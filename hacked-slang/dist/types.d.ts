import { SourceLocation } from 'acorn';
import * as es from 'estree';
import { EnvTree } from './createContext';
/**
 * Defines functions that act as built-ins, but might rely on
 * different implementations. e.g display() in a web application.
 */
export interface CustomBuiltIns {
    rawDisplay: (value: Value, str: string, externalContext: any) => Value;
    prompt: (value: Value, str: string, externalContext: any) => string | null;
    alert: (value: Value, str: string, externalContext: any) => void;
    visualiseList: (list: any, externalContext: any) => void;
}
export declare enum ErrorType {
    SYNTAX = "Syntax",
    TYPE = "Type",
    RUNTIME = "Runtime"
}
export declare enum ErrorSeverity {
    WARNING = "Warning",
    ERROR = "Error"
}
export interface SourceError {
    type: ErrorType;
    severity: ErrorSeverity;
    location: es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export interface Rule<T extends es.Node> {
    name: string;
    disableOn?: number;
    checkers: {
        [name: string]: (node: T, ancestors: es.Node[]) => SourceError[];
    };
}
export interface Comment {
    type: 'Line' | 'Block';
    value: string;
    start: number;
    end: number;
    loc: SourceLocation | undefined;
}
export declare type ExecutionMethod = 'native' | 'interpreter' | 'auto';
export declare type Variant = 'wasm' | 'lazy' | 'non-det' | 'concurrent' | 'gpu' | 'default';
export interface SourceLanguage {
    chapter: number;
    variant: Variant;
}
export declare type ValueWrapper = LetWrapper | ConstWrapper;
export interface LetWrapper {
    kind: 'let';
    getValue: () => Value;
    assignNewValue: <T>(newValue: T) => T;
}
export interface ConstWrapper {
    kind: 'const';
    getValue: () => Value;
}
export interface NativeStorage {
    builtins: Map<string, Value>;
    previousProgramsIdentifiers: Set<string>;
    operators: Map<string, (...operands: Value[]) => Value>;
    gpu: Map<string, (...operands: Value[]) => Value>;
    maxExecTime: number;
    evaller: null | ((program: string) => Value);
}
export interface Context<T = any> {
    /** The source version used */
    chapter: number;
    /** The external symbols that exist in the Context. */
    externalSymbols: string[];
    /** All the errors gathered */
    errors: SourceError[];
    /** Runtime Sepecific state */
    runtime: {
        break: boolean;
        debuggerOn: boolean;
        isRunning: boolean;
        environmentTree: EnvTree;
        environments: Environment[];
        nodes: es.Node[];
    };
    numberOfOuterEnvironments: number;
    prelude: string | null;
    /** the state of the debugger */
    debugger: {
        /** External observers watching this context */
        status: boolean;
        state: {
            it: IterableIterator<T>;
            scheduler: Scheduler;
        };
    };
    /**
     * Used for storing external properties.
     * For e.g, this can be used to store some application-related
     * context for use in your own built-in functions (like `display(a)`)
     */
    externalContext?: T;
    /**
     * Used for storing the native context and other values
     */
    nativeStorage: NativeStorage;
    /**
     * Describes the language processor to be used for evaluation
     */
    executionMethod: ExecutionMethod;
    /**
     * Describes the strategy / paradigm to be used for evaluation
     * Examples: lazy, concurrent or nondeterministic
     */
    variant: Variant;
    /**
     * Contains the evaluated code that has not yet been typechecked.
     */
    unTypecheckedCode: string[];
    typeEnvironment: TypeEnvironment;
    /**
     * Parameters to pass to a module during module initialization
     */
    moduleParams: any;
    /**
     * Storage container for module specific information and state
     */
    moduleContexts: Map<string, ModuleContext>;
    /**
     * Code previously executed in this context
     */
    previousCode: string[];
}
export interface ModuleState {
}
/**
 * Used to store state and contextual information for
 * each module
 */
export declare type ModuleContext = {
    tabs: any[];
    state?: ModuleState | null;
};
export interface BlockFrame {
    type: string;
    loc?: es.SourceLocation | null;
    enclosingLoc?: es.SourceLocation | null;
    children: (DefinitionNode | BlockFrame)[];
}
export interface DefinitionNode {
    name: string;
    type: string;
    loc?: es.SourceLocation | null;
}
export interface Frame {
    [name: string]: any;
}
export declare type Value = any;
export declare type AllowedDeclarations = 'const' | 'let';
export interface Environment {
    id: string;
    name: string;
    tail: Environment | null;
    callExpression?: es.CallExpression;
    head: Frame;
    thisContext?: Value;
}
export interface Thunk {
    value: any;
    isMemoized: boolean;
    f: () => any;
}
export interface Error {
    status: 'error';
}
export interface Finished {
    status: 'finished';
    context: Context;
    value: Value;
}
export interface Suspended {
    status: 'suspended';
    it: IterableIterator<Value>;
    scheduler: Scheduler;
    context: Context;
}
export declare type SuspendedNonDet = Omit<Suspended, 'status'> & {
    status: 'suspended-non-det';
} & {
    value: Value;
};
export declare type Result = Suspended | SuspendedNonDet | Finished | Error;
export interface Scheduler {
    run(it: IterableIterator<Value>, context: Context): Promise<Result>;
}
export interface Directive extends es.ExpressionStatement {
    type: 'ExpressionStatement';
    expression: es.Literal;
    directive: string;
}
/** For use in the substituter, to differentiate between a function declaration in the expression position,
 * which has an id, as opposed to function expressions.
 */
export interface FunctionDeclarationExpression extends es.FunctionExpression {
    id: es.Identifier;
    body: es.BlockStatement;
}
/**
 * For use in the substituter: call expressions can be reduced into an expression if the block
 * only contains a single return statement; or a block, but has to be in the expression position.
 * This is NOT compliant with the ES specifications, just as an intermediate step during substitutions.
 */
export interface BlockExpression extends es.BaseExpression {
    type: 'BlockExpression';
    body: es.Statement[];
}
export declare type substituterNodes = es.Node | BlockExpression;
export declare type TypeAnnotatedNode<T extends es.Node> = TypeAnnotation & T;
export declare type TypeAnnotatedFuncDecl = TypeAnnotatedNode<es.FunctionDeclaration> & TypedFuncDecl;
export declare type TypeAnnotation = Untypable | Typed | NotYetTyped;
export interface TypedFuncDecl {
    functionInferredType?: Type;
}
export interface Untypable {
    typability?: 'Untypable';
    inferredType?: Type;
}
export interface NotYetTyped {
    typability?: 'NotYetTyped';
    inferredType?: Type;
}
export interface Typed {
    typability?: 'Typed';
    inferredType?: Type;
}
export declare type Type = Primitive | Variable | FunctionType | List | Pair | SArray;
export declare type Constraint = 'none' | 'addable';
export interface Primitive {
    kind: 'primitive';
    name: 'number' | 'boolean' | 'string' | 'undefined';
}
export interface Variable {
    kind: 'variable';
    name: string;
    constraint: Constraint;
}
export interface FunctionType {
    kind: 'function';
    parameterTypes: Type[];
    returnType: Type;
}
export interface PredicateType {
    kind: 'predicate';
    ifTrueType: Type | ForAll;
}
export interface List {
    kind: 'list';
    elementType: Type;
}
export interface SArray {
    kind: 'array';
    elementType: Type;
}
export interface Pair {
    kind: 'pair';
    headType: Type;
    tailType: Type;
}
export interface ForAll {
    kind: 'forall';
    polyType: Type;
}
export declare type BindableType = Type | ForAll | PredicateType;
export declare type TypeEnvironment = {
    typeMap: Map<string, BindableType>;
    declKindMap: Map<string, AllowedDeclarations>;
}[];
export declare type PredicateTest = {
    node: TypeAnnotatedNode<es.CallExpression>;
    ifTrueType: Type | ForAll;
    argVarName: string;
};
export { Instruction as SVMInstruction, Program as SVMProgram, Address as SVMAddress, Argument as SVMArgument, Offset as SVMOffset, SVMFunction } from './vm/svml-compiler';
export declare type ContiguousArrayElementExpression = Exclude<es.ArrayExpression['elements'][0], null>;
export declare type ContiguousArrayElements = ContiguousArrayElementExpression[];
