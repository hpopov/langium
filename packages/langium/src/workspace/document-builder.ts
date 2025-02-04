/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import type { URI } from '../utils/uri-utils.js';
import type { ServiceRegistry } from '../service-registry.js';
import type { LangiumSharedServices } from '../services.js';
import type { AstNode } from '../syntax-tree.js';
import type { MaybePromise } from '../utils/promise-utils.js';
import type { ValidationOptions } from '../validation/document-validator.js';
import type { IndexManager } from '../workspace/index-manager.js';
import type { LangiumDocument, LangiumDocuments, LangiumDocumentFactory } from './documents.js';
import { CancellationToken, Disposable } from 'vscode-languageserver';
import { MultiMap } from '../utils/collections.js';
import { interruptAndCheck } from '../utils/promise-utils.js';
import { stream } from '../utils/stream.js';
import { ValidationCategory } from '../validation/validation-registry.js';
import { DocumentState } from './documents.js';

export interface BuildOptions {
    /**
     * Control the validation phase with this option:
     *  - `true` enables all validation checks and forces revalidating the documents
     *  - `false` or `undefined` disables all validation checks
     *  - An object runs only the necessary validation checks; the `categories` property restricts this to a specific subset
     */
    validation?: boolean | ValidationOptions
}

export interface DocumentBuildState {
    /** Whether a document has completed its last build process. */
    completed: boolean
    /** The options used for the last build process. */
    options: BuildOptions
    /** Additional information about the last build result. */
    result?: {
        validationChecks?: ValidationCategory[]
    }
}

/**
 * Shared-service for building and updating `LangiumDocument`s.
 */
export interface DocumentBuilder {

    /** The options used for rebuilding documents after an update. */
    updateBuildOptions: BuildOptions;

    /**
     * Execute all necessary build steps for the given documents.
     *
     * @param documents Set of documents to be built.
     * @param options Options for the document builder.
     * @param cancelToken Indicates when to cancel the current operation.
     * @throws `OperationCanceled` if a user action occurs during execution
     */
    build<T extends AstNode>(documents: Array<LangiumDocument<T>>, options?: BuildOptions, cancelToken?: CancellationToken): Promise<void>;

    /**
     * This method is called when a document change is detected. It updates the state of all
     * affected documents, including those with references to the changed ones, so they are rebuilt.
     *
     * @param changed URIs of changed or created documents
     * @param deleted URIs of deleted documents
     * @param cancelToken allows to cancel the current operation
     * @throws `OperationCancelled` if cancellation is detected during execution
     */
    update(changed: URI[], deleted: URI[], cancelToken?: CancellationToken): Promise<void>;

    /**
     * Notify the given callback when a document update was triggered, but before any document
     * is rebuilt. Listeners to this event should not perform any long-running task.
     */
    onUpdate(callback: DocumentUpdateListener): Disposable;

    /**
     * Notify the given callback when a set of documents has been built reaching a desired target state.
     */
    onBuildPhase(targetState: DocumentState, callback: DocumentBuildListener): Disposable;
}

export type DocumentUpdateListener = (changed: URI[], deleted: URI[]) => void | Promise<void>
export type DocumentBuildListener = (built: LangiumDocument[], cancelToken: CancellationToken) => void | Promise<void>
export class DefaultDocumentBuilder implements DocumentBuilder {

    updateBuildOptions: BuildOptions = {
        // Default: run only the built-in validation checks and those in the _fast_ category (includes those without category)
        validation: {
            categories: ['built-in', 'fast']
        }
    };

    protected readonly langiumDocuments: LangiumDocuments;
    protected readonly langiumDocumentFactory: LangiumDocumentFactory;
    protected readonly indexManager: IndexManager;
    protected readonly serviceRegistry: ServiceRegistry;
    protected readonly updateListeners: DocumentUpdateListener[] = [];
    protected readonly buildPhaseListeners: MultiMap<DocumentState, DocumentBuildListener> = new MultiMap();
    protected readonly buildState: Map<string, DocumentBuildState> = new Map();

    constructor(services: LangiumSharedServices) {
        this.langiumDocuments = services.workspace.LangiumDocuments;
        this.langiumDocumentFactory = services.workspace.LangiumDocumentFactory;
        this.indexManager = services.workspace.IndexManager;
        this.serviceRegistry = services.ServiceRegistry;
    }

    async build<T extends AstNode>(documents: Array<LangiumDocument<T>>, options: BuildOptions = {}, cancelToken = CancellationToken.None): Promise<void> {
        for (const document of documents) {
            const key = document.uri.toString();
            if (document.state === DocumentState.Validated) {
                if (typeof options.validation === 'boolean' && options.validation) {
                    // Force re-running all validation checks
                    document.state = DocumentState.IndexedReferences;
                    document.diagnostics = undefined;
                    this.buildState.delete(key);
                } else if (typeof options.validation === 'object') {
                    const buildState = this.buildState.get(key);
                    const previousCategories = buildState?.result?.validationChecks;
                    if (previousCategories) {
                        // Validation with explicit options was requested for a document that has already been partly validated.
                        // In this case, we need to merge the previous validation categories with the new ones.
                        const newCategories = options.validation.categories ?? ValidationCategory.all as ValidationCategory[];
                        const categories = newCategories.filter(c => !previousCategories.includes(c));
                        if (categories.length > 0) {
                            this.buildState.set(key, {
                                completed: false,
                                options: {
                                    validation: {
                                        ...options.validation,
                                        categories
                                    }
                                },
                                result: buildState.result
                            });
                            document.state = DocumentState.IndexedReferences;
                        }
                    }
                }
            } else {
                // Default: forget any previous build options
                this.buildState.delete(key);
            }
        }
        await this.emitUpdate(documents.map(e => e.uri), []);
        await this.buildDocuments(documents, options, cancelToken);
    }

    async update(changed: URI[], deleted: URI[], cancelToken = CancellationToken.None): Promise<void> {
        // Remove all metadata of documents that are reported as deleted
        for (const deletedUri of deleted) {
            this.langiumDocuments.deleteDocument(deletedUri);
            this.buildState.delete(deletedUri.toString());
            this.indexManager.remove(deletedUri);
        }
        // Set the state of all changed documents to `Changed` so they are completely rebuilt
        for (const changedUri of changed) {
            const invalidated = this.langiumDocuments.invalidateDocument(changedUri);
            if (!invalidated) {
                // We create an unparsed, invalid document.
                // This will be parsed as soon as we reach the first document builder phase.
                // This allows to cancel the parsing process later in case we need it.
                const newDocument = this.langiumDocumentFactory.fromModel({ $type: 'INVALID' }, changedUri);
                newDocument.state = DocumentState.Changed;
                this.langiumDocuments.addDocument(newDocument);
            }
            this.buildState.delete(changedUri.toString());
        }
        // Set the state of all documents that should be relinked to `ComputedScopes` (if not already lower)
        const allChangedUris = stream(changed).concat(deleted).map(uri => uri.toString()).toSet();
        this.langiumDocuments.all
            .filter(doc => !allChangedUris.has(doc.uri.toString()) && this.shouldRelink(doc, allChangedUris))
            .forEach(doc => {
                const linker = this.serviceRegistry.getServices(doc.uri).references.Linker;
                linker.unlink(doc);
                doc.state = Math.min(doc.state, DocumentState.ComputedScopes);
                doc.diagnostics = undefined;
            });
        // Notify listeners of the update
        await this.emitUpdate(changed, deleted);
        // Only allow interrupting the execution after all state changes are done
        await interruptAndCheck(cancelToken);

        // Collect all documents that we should rebuild
        const rebuildDocuments = this.langiumDocuments.all
            .filter(doc =>
                // This includes those that were reported as changed and those that we selected for relinking
                doc.state < DocumentState.Linked
                // This includes those for which a previous build has been cancelled
                || !this.buildState.get(doc.uri.toString())?.completed
            )
            .toArray();
        await this.buildDocuments(rebuildDocuments, this.updateBuildOptions, cancelToken);
    }

    protected async emitUpdate(changed: URI[], deleted: URI[]): Promise<void> {
        await Promise.all(this.updateListeners.map(listener => listener(changed, deleted)));
    }

    /**
     * Check whether the given document should be relinked after changes were found in the given URIs.
     */
    protected shouldRelink(document: LangiumDocument, changedUris: Set<string>): boolean {
        // Relink documents with linking errors -- maybe those references can be resolved now
        if (document.references.some(ref => ref.error !== undefined)) {
            return true;
        }
        // Check whether the document is affected by any of the changed URIs
        return this.indexManager.isAffected(document, changedUris);
    }

    onUpdate(callback: DocumentUpdateListener): Disposable {
        this.updateListeners.push(callback);
        return Disposable.create(() => {
            const index = this.updateListeners.indexOf(callback);
            if (index >= 0) {
                this.updateListeners.splice(index, 1);
            }
        });
    }

    /**
     * Build the given documents by stepping through all build phases. If a document's state indicates
     * that a certain build phase is already done, the phase is skipped for that document.
     */
    protected async buildDocuments(documents: LangiumDocument[], options: BuildOptions, cancelToken: CancellationToken): Promise<void> {
        this.prepareBuild(documents, options);
        // 0. Parse content
        await this.runCancelable(documents, DocumentState.Parsed, cancelToken, doc => {
            this.langiumDocumentFactory.update(doc, cancelToken);
        });
        // 1. Index content
        await this.runCancelable(documents, DocumentState.IndexedContent, cancelToken, doc =>
            this.indexManager.updateContent(doc, cancelToken)
        );
        // 2. Compute scopes
        await this.runCancelable(documents, DocumentState.ComputedScopes, cancelToken, async doc => {
            const scopeComputation = this.serviceRegistry.getServices(doc.uri).references.ScopeComputation;
            doc.precomputedScopes = await scopeComputation.computeLocalScopes(doc, cancelToken);
        });
        // 3. Linking
        await this.runCancelable(documents, DocumentState.Linked, cancelToken, doc => {
            const linker = this.serviceRegistry.getServices(doc.uri).references.Linker;
            return linker.link(doc, cancelToken);
        });
        // 4. Index references
        await this.runCancelable(documents, DocumentState.IndexedReferences, cancelToken, doc =>
            this.indexManager.updateReferences(doc, cancelToken)
        );
        // 5. Validation
        const toBeValidated = documents.filter(doc => this.shouldValidate(doc));
        await this.runCancelable(toBeValidated, DocumentState.Validated, cancelToken, doc =>
            this.validate(doc, cancelToken)
        );

        // If we've made it to this point without being cancelled, we can mark the build state as completed.
        for (const doc of documents) {
            const state = this.buildState.get(doc.uri.toString());
            if (state) {
                state.completed = true;
            }
        }
    }

    protected prepareBuild(documents: LangiumDocument[], options: BuildOptions): void {
        for (const doc of documents) {
            const key = doc.uri.toString();
            const state = this.buildState.get(key);
            // If the document has no previous build state, we set it. If it has one, but it's already marked
            // as completed, we overwrite it. If the previous build was not completed, we keep its state
            // and continue where it was cancelled.
            if (!state || state.completed) {
                this.buildState.set(key, {
                    completed: false,
                    options,
                    result: state?.result
                });
            }
        }
    }

    protected async runCancelable(documents: LangiumDocument[], targetState: DocumentState, cancelToken: CancellationToken,
        callback: (document: LangiumDocument) => MaybePromise<void>): Promise<void> {
        const filtered = documents.filter(e => e.state < targetState);
        for (const document of filtered) {
            await interruptAndCheck(cancelToken);
            await callback(document);
            document.state = targetState;
        }
        await this.notifyBuildPhase(filtered, targetState, cancelToken);
    }

    onBuildPhase(targetState: DocumentState, callback: DocumentBuildListener): Disposable {
        this.buildPhaseListeners.add(targetState, callback);
        return Disposable.create(() => {
            this.buildPhaseListeners.delete(targetState, callback);
        });
    }

    protected async notifyBuildPhase(documents: LangiumDocument[], state: DocumentState, cancelToken: CancellationToken): Promise<void> {
        if (documents.length === 0) {
            // Don't notify when no document has been processed
            return;
        }
        const listeners = this.buildPhaseListeners.get(state);
        for (const listener of listeners) {
            await interruptAndCheck(cancelToken);
            await listener(documents, cancelToken);
        }
    }

    /**
     * Determine whether the given document should be validated during a build. The default
     * implementation checks the `validation` property of the build options. If it's set to `true`
     * or a `ValidationOptions` object, the document is included in the validation phase.
     */
    protected shouldValidate(document: LangiumDocument): boolean {
        return Boolean(this.getBuildOptions(document).validation);
    }

    /**
     * Run validation checks on the given document and store the resulting diagnostics in the document.
     * If the document already contains diagnostics, the new ones are added to the list.
     */
    protected async validate(document: LangiumDocument, cancelToken: CancellationToken): Promise<void> {
        const validator = this.serviceRegistry.getServices(document.uri).validation.DocumentValidator;
        const validationSetting = this.getBuildOptions(document).validation;
        const options = typeof validationSetting === 'object' ? validationSetting : undefined;
        const diagnostics = await validator.validateDocument(document, options, cancelToken);
        if (document.diagnostics) {
            document.diagnostics.push(...diagnostics);
        } else {
            document.diagnostics = diagnostics;
        }

        // Store information about the executed validation in the build state
        const state = this.buildState.get(document.uri.toString());
        if (state) {
            state.result ??= {};
            const newCategories = options?.categories ?? ValidationCategory.all;
            if (state.result.validationChecks) {
                state.result.validationChecks.push(...newCategories);
            } else {
                state.result.validationChecks = [...newCategories];
            }
        }
    }

    protected getBuildOptions(document: LangiumDocument): BuildOptions {
        return this.buildState.get(document.uri.toString())?.options ?? {};
    }

}
