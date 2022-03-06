import { Options as AcornOptions } from 'acorn';
import * as es from 'estree';
import { Context, ErrorSeverity, ErrorType, SourceError } from '../types';
export declare class DisallowedConstructError implements SourceError {
    node: es.Node;
    type: ErrorType;
    severity: ErrorSeverity;
    nodeType: string;
    constructor(node: es.Node);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
    /**
     * Converts estree node.type into english
     * e.g. ThisExpression -> 'this' expressions
     *      Property -> Properties
     *      EmptyStatement -> Empty Statements
     */
    private formatNodeType;
}
export declare class FatalSyntaxError implements SourceError {
    location: es.SourceLocation;
    message: string;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(location: es.SourceLocation, message: string);
    explain(): string;
    elaborate(): string;
}
export declare class MissingSemicolonError implements SourceError {
    location: es.SourceLocation;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(location: es.SourceLocation);
    explain(): string;
    elaborate(): string;
}
export declare class TrailingCommaError implements SourceError {
    location: es.SourceLocation;
    type: ErrorType.SYNTAX;
    severity: ErrorSeverity.WARNING;
    constructor(location: es.SourceLocation);
    explain(): string;
    elaborate(): string;
}
export declare function parseAt(source: string, num: number): import("acorn").Node | undefined;
export declare function parse(source: string, context: Context): es.Program | undefined;
export declare function tokenize(source: string, context: Context): import("acorn").Token[];
export declare const createAcornParserOptions: (context: Context) => AcornOptions;
export declare function parseForNames(source: string): [es.Program, acorn.Comment[]];
export declare function looseParse(source: string, context: Context): es.Program;
export declare function typedParse(code: any, context: Context): import("../types").TypeAnnotatedNode<es.Program> | null;
