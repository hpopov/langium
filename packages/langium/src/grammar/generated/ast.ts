/******************************************************************************
 * This file was generated by langium-cli 1.0.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import { AstNode, AbstractAstReflection, Reference, ReferenceInfo, TypeMetaData } from '../../syntax-tree';

export type AbstractRule = ParserRule | TerminalRule;

export const AbstractRule = 'AbstractRule';

export function isAbstractRule(item: unknown): item is AbstractRule {
    return reflection.isInstance(item, AbstractRule);
}

export type AbstractType = Action | Interface | ParserRule | Type;

export const AbstractType = 'AbstractType';

export function isAbstractType(item: unknown): item is AbstractType {
    return reflection.isInstance(item, AbstractType);
}

export type Condition = Conjunction | Disjunction | LiteralCondition | Negation | ParameterReference;

export const Condition = 'Condition';

export function isCondition(item: unknown): item is Condition {
    return reflection.isInstance(item, Condition);
}

export type FeatureName = string;

export type PrimitiveType = 'Date' | 'bigint' | 'boolean' | 'number' | 'string';

export interface AbstractElement extends AstNode {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'AbstractElement' | 'Action' | 'Alternatives' | 'Assignment' | 'CharacterRange' | 'CrossReference' | 'Group' | 'Keyword' | 'NegatedToken' | 'RegexToken' | 'RuleCall' | 'TerminalAlternatives' | 'TerminalGroup' | 'TerminalRuleCall' | 'UnorderedGroup' | 'UntilToken' | 'Wildcard';
    cardinality?: '*' | '+' | '?'
}

export const AbstractElement = 'AbstractElement';

export function isAbstractElement(item: unknown): item is AbstractElement {
    return reflection.isInstance(item, AbstractElement);
}

export interface AtomType extends AstNode {
    readonly $container: Type | TypeAttribute;
    readonly $type: 'AtomType';
    isArray: boolean
    isRef: boolean
    keywordType?: Keyword
    primitiveType?: PrimitiveType
    refType?: Reference<AbstractType>
}

export const AtomType = 'AtomType';

export function isAtomType(item: unknown): item is AtomType {
    return reflection.isInstance(item, AtomType);
}

export interface Conjunction extends AstNode {
    readonly $type: 'Conjunction';
    left: Condition
    right: Condition
}

export const Conjunction = 'Conjunction';

export function isConjunction(item: unknown): item is Conjunction {
    return reflection.isInstance(item, Conjunction);
}

export interface Disjunction extends AstNode {
    readonly $type: 'Disjunction';
    left: Condition
    right: Condition
}

export const Disjunction = 'Disjunction';

export function isDisjunction(item: unknown): item is Disjunction {
    return reflection.isInstance(item, Disjunction);
}

export interface Grammar extends AstNode {
    readonly $type: 'Grammar';
    definesHiddenTokens: boolean
    hiddenTokens: Array<Reference<AbstractRule>>
    imports: Array<GrammarImport>
    interfaces: Array<Interface>
    isDeclared: boolean
    name?: string
    rules: Array<AbstractRule>
    types: Array<Type>
    usedGrammars: Array<Reference<Grammar>>
}

export const Grammar = 'Grammar';

export function isGrammar(item: unknown): item is Grammar {
    return reflection.isInstance(item, Grammar);
}

export interface GrammarImport extends AstNode {
    readonly $container: Grammar;
    readonly $type: 'GrammarImport';
    path: string
}

export const GrammarImport = 'GrammarImport';

export function isGrammarImport(item: unknown): item is GrammarImport {
    return reflection.isInstance(item, GrammarImport);
}

export interface InferredType extends AstNode {
    readonly $container: Action | ParserRule;
    readonly $type: 'InferredType';
    name: string
}

export const InferredType = 'InferredType';

export function isInferredType(item: unknown): item is InferredType {
    return reflection.isInstance(item, InferredType);
}

export interface Interface extends AstNode {
    readonly $container: Grammar;
    readonly $type: 'Interface';
    attributes: Array<TypeAttribute>
    name: string
    superTypes: Array<Reference<AbstractType>>
}

export const Interface = 'Interface';

export function isInterface(item: unknown): item is Interface {
    return reflection.isInstance(item, Interface);
}

export interface LiteralCondition extends AstNode {
    readonly $type: 'LiteralCondition';
    true: boolean
}

export const LiteralCondition = 'LiteralCondition';

export function isLiteralCondition(item: unknown): item is LiteralCondition {
    return reflection.isInstance(item, LiteralCondition);
}

export interface NamedArgument extends AstNode {
    readonly $container: RuleCall;
    readonly $type: 'NamedArgument';
    calledByName: boolean
    parameter?: Reference<Parameter>
    value: Condition
}

export const NamedArgument = 'NamedArgument';

export function isNamedArgument(item: unknown): item is NamedArgument {
    return reflection.isInstance(item, NamedArgument);
}

export interface Negation extends AstNode {
    readonly $type: 'Negation';
    value: Condition
}

export const Negation = 'Negation';

export function isNegation(item: unknown): item is Negation {
    return reflection.isInstance(item, Negation);
}

export interface Parameter extends AstNode {
    readonly $container: ParserRule;
    readonly $type: 'Parameter';
    name: string
}

export const Parameter = 'Parameter';

export function isParameter(item: unknown): item is Parameter {
    return reflection.isInstance(item, Parameter);
}

export interface ParameterReference extends AstNode {
    readonly $type: 'ParameterReference';
    parameter: Reference<Parameter>
}

export const ParameterReference = 'ParameterReference';

export function isParameterReference(item: unknown): item is ParameterReference {
    return reflection.isInstance(item, ParameterReference);
}

export interface ParserRule extends AstNode {
    readonly $type: 'ParserRule';
    dataType?: PrimitiveType
    definesHiddenTokens: boolean
    definition: AbstractElement
    entry: boolean
    fragment: boolean
    hiddenTokens: Array<Reference<AbstractRule>>
    inferredType?: InferredType
    name: string
    parameters: Array<Parameter>
    returnType?: Reference<AbstractType>
    wildcard: boolean
}

export const ParserRule = 'ParserRule';

export function isParserRule(item: unknown): item is ParserRule {
    return reflection.isInstance(item, ParserRule);
}

export interface ReturnType extends AstNode {
    readonly $container: TerminalRule;
    readonly $type: 'ReturnType';
    name: PrimitiveType | string
}

export const ReturnType = 'ReturnType';

export function isReturnType(item: unknown): item is ReturnType {
    return reflection.isInstance(item, ReturnType);
}

export interface TerminalRule extends AstNode {
    readonly $type: 'TerminalRule';
    definition: AbstractElement
    fragment: boolean
    hidden: boolean
    name: string
    type?: ReturnType
}

export const TerminalRule = 'TerminalRule';

export function isTerminalRule(item: unknown): item is TerminalRule {
    return reflection.isInstance(item, TerminalRule);
}

export interface Type extends AstNode {
    readonly $container: Grammar;
    readonly $type: 'Type';
    name: string
    typeAlternatives: Array<AtomType>
}

export const Type = 'Type';

export function isType(item: unknown): item is Type {
    return reflection.isInstance(item, Type);
}

export interface TypeAttribute extends AstNode {
    readonly $container: Interface;
    readonly $type: 'TypeAttribute';
    isOptional: boolean
    name: FeatureName
    typeAlternatives: Array<AtomType>
}

export const TypeAttribute = 'TypeAttribute';

export function isTypeAttribute(item: unknown): item is TypeAttribute {
    return reflection.isInstance(item, TypeAttribute);
}

export interface Action extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'Action';
    feature?: FeatureName
    inferredType?: InferredType
    operator?: '+=' | '='
    type?: Reference<AbstractType>
}

export const Action = 'Action';

export function isAction(item: unknown): item is Action {
    return reflection.isInstance(item, Action);
}

export interface Alternatives extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'Alternatives';
    elements: Array<AbstractElement>
}

export const Alternatives = 'Alternatives';

export function isAlternatives(item: unknown): item is Alternatives {
    return reflection.isInstance(item, Alternatives);
}

export interface Assignment extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'Assignment';
    feature: FeatureName
    operator: '+=' | '=' | '?='
    terminal: AbstractElement
}

export const Assignment = 'Assignment';

export function isAssignment(item: unknown): item is Assignment {
    return reflection.isInstance(item, Assignment);
}

export interface CharacterRange extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'CharacterRange';
    left: Keyword
    right?: Keyword
}

export const CharacterRange = 'CharacterRange';

export function isCharacterRange(item: unknown): item is CharacterRange {
    return reflection.isInstance(item, CharacterRange);
}

export interface CrossReference extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'CrossReference';
    deprecatedSyntax: boolean
    terminal?: AbstractElement
    type: Reference<AbstractType>
}

export const CrossReference = 'CrossReference';

export function isCrossReference(item: unknown): item is CrossReference {
    return reflection.isInstance(item, CrossReference);
}

export interface Group extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'Group';
    elements: Array<AbstractElement>
    guardCondition?: Condition
}

export const Group = 'Group';

export function isGroup(item: unknown): item is Group {
    return reflection.isInstance(item, Group);
}

export interface Keyword extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'Keyword';
    value: string
}

export const Keyword = 'Keyword';

export function isKeyword(item: unknown): item is Keyword {
    return reflection.isInstance(item, Keyword);
}

export interface NegatedToken extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'NegatedToken';
    terminal: AbstractElement
}

export const NegatedToken = 'NegatedToken';

export function isNegatedToken(item: unknown): item is NegatedToken {
    return reflection.isInstance(item, NegatedToken);
}

export interface RegexToken extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'RegexToken';
    regex: string
}

export const RegexToken = 'RegexToken';

export function isRegexToken(item: unknown): item is RegexToken {
    return reflection.isInstance(item, RegexToken);
}

export interface RuleCall extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'RuleCall';
    arguments: Array<NamedArgument>
    rule: Reference<AbstractRule>
}

export const RuleCall = 'RuleCall';

export function isRuleCall(item: unknown): item is RuleCall {
    return reflection.isInstance(item, RuleCall);
}

export interface TerminalAlternatives extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'TerminalAlternatives';
    elements: Array<AbstractElement>
}

export const TerminalAlternatives = 'TerminalAlternatives';

export function isTerminalAlternatives(item: unknown): item is TerminalAlternatives {
    return reflection.isInstance(item, TerminalAlternatives);
}

export interface TerminalGroup extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'TerminalGroup';
    elements: Array<AbstractElement>
}

export const TerminalGroup = 'TerminalGroup';

export function isTerminalGroup(item: unknown): item is TerminalGroup {
    return reflection.isInstance(item, TerminalGroup);
}

export interface TerminalRuleCall extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'TerminalRuleCall';
    rule: Reference<TerminalRule>
}

export const TerminalRuleCall = 'TerminalRuleCall';

export function isTerminalRuleCall(item: unknown): item is TerminalRuleCall {
    return reflection.isInstance(item, TerminalRuleCall);
}

export interface UnorderedGroup extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'UnorderedGroup';
    elements: Array<AbstractElement>
}

export const UnorderedGroup = 'UnorderedGroup';

export function isUnorderedGroup(item: unknown): item is UnorderedGroup {
    return reflection.isInstance(item, UnorderedGroup);
}

export interface UntilToken extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'UntilToken';
    terminal: AbstractElement
}

export const UntilToken = 'UntilToken';

export function isUntilToken(item: unknown): item is UntilToken {
    return reflection.isInstance(item, UntilToken);
}

export interface Wildcard extends AbstractElement {
    readonly $container: Alternatives | Assignment | AtomType | CharacterRange | CrossReference | Group | NegatedToken | ParserRule | TerminalAlternatives | TerminalGroup | TerminalRule | UnorderedGroup | UntilToken;
    readonly $type: 'Wildcard';
}

export const Wildcard = 'Wildcard';

export function isWildcard(item: unknown): item is Wildcard {
    return reflection.isInstance(item, Wildcard);
}

export interface LangiumGrammarAstType {
    AbstractElement: AbstractElement
    AbstractRule: AbstractRule
    AbstractType: AbstractType
    Action: Action
    Alternatives: Alternatives
    Assignment: Assignment
    AtomType: AtomType
    CharacterRange: CharacterRange
    Condition: Condition
    Conjunction: Conjunction
    CrossReference: CrossReference
    Disjunction: Disjunction
    Grammar: Grammar
    GrammarImport: GrammarImport
    Group: Group
    InferredType: InferredType
    Interface: Interface
    Keyword: Keyword
    LiteralCondition: LiteralCondition
    NamedArgument: NamedArgument
    NegatedToken: NegatedToken
    Negation: Negation
    Parameter: Parameter
    ParameterReference: ParameterReference
    ParserRule: ParserRule
    RegexToken: RegexToken
    ReturnType: ReturnType
    RuleCall: RuleCall
    TerminalAlternatives: TerminalAlternatives
    TerminalGroup: TerminalGroup
    TerminalRule: TerminalRule
    TerminalRuleCall: TerminalRuleCall
    Type: Type
    TypeAttribute: TypeAttribute
    UnorderedGroup: UnorderedGroup
    UntilToken: UntilToken
    Wildcard: Wildcard
}

export class LangiumGrammarAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return ['AbstractElement', 'AbstractRule', 'AbstractType', 'Action', 'Alternatives', 'Assignment', 'AtomType', 'CharacterRange', 'Condition', 'Conjunction', 'CrossReference', 'Disjunction', 'Grammar', 'GrammarImport', 'Group', 'InferredType', 'Interface', 'Keyword', 'LiteralCondition', 'NamedArgument', 'NegatedToken', 'Negation', 'Parameter', 'ParameterReference', 'ParserRule', 'RegexToken', 'ReturnType', 'RuleCall', 'TerminalAlternatives', 'TerminalGroup', 'TerminalRule', 'TerminalRuleCall', 'Type', 'TypeAttribute', 'UnorderedGroup', 'UntilToken', 'Wildcard'];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case Conjunction:
            case Disjunction:
            case LiteralCondition:
            case Negation:
            case ParameterReference: {
                return this.isSubtype(Condition, supertype);
            }
            case Interface:
            case Type: {
                return this.isSubtype(AbstractType, supertype);
            }
            case ParserRule: {
                return this.isSubtype(AbstractRule, supertype) || this.isSubtype(AbstractType, supertype);
            }
            case TerminalRule: {
                return this.isSubtype(AbstractRule, supertype);
            }
            case Action: {
                return this.isSubtype(AbstractElement, supertype) || this.isSubtype(AbstractType, supertype);
            }
            case Alternatives:
            case Assignment:
            case CharacterRange:
            case CrossReference:
            case Group:
            case Keyword:
            case NegatedToken:
            case RegexToken:
            case RuleCall:
            case TerminalAlternatives:
            case TerminalGroup:
            case TerminalRuleCall:
            case UnorderedGroup:
            case UntilToken:
            case Wildcard: {
                return this.isSubtype(AbstractElement, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'Action:type':
            case 'AtomType:refType':
            case 'CrossReference:type':
            case 'Interface:superTypes':
            case 'ParserRule:returnType': {
                return AbstractType;
            }
            case 'Grammar:hiddenTokens':
            case 'ParserRule:hiddenTokens':
            case 'RuleCall:rule': {
                return AbstractRule;
            }
            case 'Grammar:usedGrammars': {
                return Grammar;
            }
            case 'NamedArgument:parameter':
            case 'ParameterReference:parameter': {
                return Parameter;
            }
            case 'TerminalRuleCall:rule': {
                return TerminalRule;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case 'AtomType': {
                return {
                    name: 'AtomType',
                    mandatory: [
                        { name: 'isArray', type: 'boolean' },
                        { name: 'isRef', type: 'boolean' }
                    ]
                };
            }
            case 'Grammar': {
                return {
                    name: 'Grammar',
                    mandatory: [
                        { name: 'definesHiddenTokens', type: 'boolean' },
                        { name: 'hiddenTokens', type: 'array' },
                        { name: 'imports', type: 'array' },
                        { name: 'interfaces', type: 'array' },
                        { name: 'isDeclared', type: 'boolean' },
                        { name: 'rules', type: 'array' },
                        { name: 'types', type: 'array' },
                        { name: 'usedGrammars', type: 'array' }
                    ]
                };
            }
            case 'Interface': {
                return {
                    name: 'Interface',
                    mandatory: [
                        { name: 'attributes', type: 'array' },
                        { name: 'superTypes', type: 'array' }
                    ]
                };
            }
            case 'LiteralCondition': {
                return {
                    name: 'LiteralCondition',
                    mandatory: [
                        { name: 'true', type: 'boolean' }
                    ]
                };
            }
            case 'NamedArgument': {
                return {
                    name: 'NamedArgument',
                    mandatory: [
                        { name: 'calledByName', type: 'boolean' }
                    ]
                };
            }
            case 'ParserRule': {
                return {
                    name: 'ParserRule',
                    mandatory: [
                        { name: 'definesHiddenTokens', type: 'boolean' },
                        { name: 'entry', type: 'boolean' },
                        { name: 'fragment', type: 'boolean' },
                        { name: 'hiddenTokens', type: 'array' },
                        { name: 'parameters', type: 'array' },
                        { name: 'wildcard', type: 'boolean' }
                    ]
                };
            }
            case 'TerminalRule': {
                return {
                    name: 'TerminalRule',
                    mandatory: [
                        { name: 'fragment', type: 'boolean' },
                        { name: 'hidden', type: 'boolean' }
                    ]
                };
            }
            case 'Type': {
                return {
                    name: 'Type',
                    mandatory: [
                        { name: 'typeAlternatives', type: 'array' }
                    ]
                };
            }
            case 'TypeAttribute': {
                return {
                    name: 'TypeAttribute',
                    mandatory: [
                        { name: 'isOptional', type: 'boolean' },
                        { name: 'typeAlternatives', type: 'array' }
                    ]
                };
            }
            case 'Alternatives': {
                return {
                    name: 'Alternatives',
                    mandatory: [
                        { name: 'elements', type: 'array' }
                    ]
                };
            }
            case 'CrossReference': {
                return {
                    name: 'CrossReference',
                    mandatory: [
                        { name: 'deprecatedSyntax', type: 'boolean' }
                    ]
                };
            }
            case 'Group': {
                return {
                    name: 'Group',
                    mandatory: [
                        { name: 'elements', type: 'array' }
                    ]
                };
            }
            case 'RuleCall': {
                return {
                    name: 'RuleCall',
                    mandatory: [
                        { name: 'arguments', type: 'array' }
                    ]
                };
            }
            case 'TerminalAlternatives': {
                return {
                    name: 'TerminalAlternatives',
                    mandatory: [
                        { name: 'elements', type: 'array' }
                    ]
                };
            }
            case 'TerminalGroup': {
                return {
                    name: 'TerminalGroup',
                    mandatory: [
                        { name: 'elements', type: 'array' }
                    ]
                };
            }
            case 'UnorderedGroup': {
                return {
                    name: 'UnorderedGroup',
                    mandatory: [
                        { name: 'elements', type: 'array' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}

export const reflection = new LangiumGrammarAstReflection();
