/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AstNode, AstReflection, Reference, isAstNode } from 'langium';

export interface AbstractElement extends AstNode {
}

export const AbstractElement = 'AbstractElement';

export function isAbstractElement(item: unknown): item is AbstractElement {
    return reflection.isInstance(item, AbstractElement);
}

export interface Domainmodel extends AstNode {
    elements: Array<AbstractElement>
}

export const Domainmodel = 'Domainmodel';

export function isDomainmodel(item: unknown): item is Domainmodel {
    return reflection.isInstance(item, Domainmodel);
}

export interface Feature extends AstNode {
    many: boolean
    name: string
    type: Reference<Type>
}

export const Feature = 'Feature';

export function isFeature(item: unknown): item is Feature {
    return reflection.isInstance(item, Feature);
}

export interface Type extends AstNode {
    name: string
}

export const Type = 'Type';

export function isType(item: unknown): item is Type {
    return reflection.isInstance(item, Type);
}

export interface Import extends AbstractElement {
    importedNamespace: string
}

export const Import = 'Import';

export function isImport(item: unknown): item is Import {
    return reflection.isInstance(item, Import);
}

export interface PackageDeclaration extends AbstractElement {
    name: string
    elements: Array<AbstractElement>
}

export const PackageDeclaration = 'PackageDeclaration';

export function isPackageDeclaration(item: unknown): item is PackageDeclaration {
    return reflection.isInstance(item, PackageDeclaration);
}

export interface DataType extends Type {
}

export const DataType = 'DataType';

export function isDataType(item: unknown): item is DataType {
    return reflection.isInstance(item, DataType);
}

export interface Entity extends Type {
    superType?: Reference<Entity>
    features: Array<Feature>
}

export const Entity = 'Entity';

export function isEntity(item: unknown): item is Entity {
    return reflection.isInstance(item, Entity);
}

export type DomainModelAstType = 'AbstractElement' | 'Domainmodel' | 'Feature' | 'Type' | 'Import' | 'PackageDeclaration' | 'DataType' | 'Entity';

export type DomainModelAstReference = 'Feature:type' | 'Entity:superType';

export class DomainModelAstReflection implements AstReflection {

    getAllTypes(): string[] {
        return ['AbstractElement', 'Domainmodel', 'Feature', 'Type', 'Import', 'PackageDeclaration', 'DataType', 'Entity'];
    }

    isInstance(node: unknown, type: string): boolean {
        return isAstNode(node) && this.isSubtype(node.$type, type);
    }

    isSubtype(subtype: string, supertype: string): boolean {
        if (subtype === supertype) {
            return true;
        }
        switch (subtype) {
            case Import:
            case PackageDeclaration: {
                return this.isSubtype(AbstractElement, supertype);
            }
            case DataType:
            case Entity: {
                return this.isSubtype(Type, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(referenceId: DomainModelAstReference): string {
        switch (referenceId) {
            case 'Feature:type': {
                return Type;
            }
            case 'Entity:superType': {
                return Entity;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }
}

export const reflection = new DomainModelAstReflection();
