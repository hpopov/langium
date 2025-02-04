/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import type { LangiumServices } from './services.js';
import { UriUtils, type URI } from './utils/uri-utils.js';

/**
 * The service registry provides access to the language-specific services. These are resolved
 * via the URI of a text document.
 */
export interface ServiceRegistry {

    /**
     * Register a language via its injected services.
     */
    register(language: LangiumServices): void;

    /**
     * Retrieve the language-specific services for the given URI. In case only one language is
     * registered, it may be used regardless of the URI format.
     */
    getServices(uri: URI): LangiumServices;

    /**
     * The full set of registered language services.
     */
    readonly all: readonly LangiumServices[];
}

export class DefaultServiceRegistry implements ServiceRegistry {

    protected singleton?: LangiumServices;
    protected map?: Record<string, LangiumServices>;

    register(language: LangiumServices): void {
        if (!this.singleton && !this.map) {
            // This is the first language to be registered; store it as singleton.
            this.singleton = language;
            return;
        }
        if (!this.map) {
            this.map = {};
            if (this.singleton) {
                // Move the previous singleton instance to the new map.
                for (const ext of this.singleton.LanguageMetaData.fileExtensions) {
                    this.map[ext] = this.singleton;
                }
                this.singleton = undefined;
            }
        }
        // Store the language services in the map.
        for (const ext of language.LanguageMetaData.fileExtensions) {
            if (this.map[ext] !== undefined && this.map[ext] !== language) {
                console.warn(`The file extension ${ext} is used by multiple languages. It is now assigned to '${language.LanguageMetaData.languageId}'.`);
            }
            this.map[ext] = language;
        }
    }

    getServices(uri: URI): LangiumServices {
        if (this.singleton !== undefined) {
            return this.singleton;
        }
        if (this.map === undefined) {
            throw new Error('The service registry is empty. Use `register` to register the services of a language.');
        }
        const ext = UriUtils.extname(uri);
        const services = this.map[ext];
        if (!services) {
            throw new Error(`The service registry contains no services for the extension '${ext}'.`);
        }
        return services;
    }

    get all(): readonly LangiumServices[] {
        if (this.singleton !== undefined) {
            return [this.singleton];
        }
        if (this.map !== undefined) {
            return Object.values(this.map);
        }
        return [];
    }
}
