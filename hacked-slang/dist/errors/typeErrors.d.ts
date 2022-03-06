import * as es from 'estree';
import { ErrorSeverity, ErrorType, SArray, SourceError, Type, TypeAnnotatedNode } from '../types';
export declare class InvalidArrayIndexType implements SourceError {
    node: TypeAnnotatedNode<es.Node>;
    receivedType: Type;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.Node>, receivedType: Type);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class ArrayAssignmentError implements SourceError {
    node: TypeAnnotatedNode<es.Node>;
    arrayType: SArray;
    receivedType: SArray;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.Node>, arrayType: SArray, receivedType: SArray);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class ReassignConstError implements SourceError {
    node: TypeAnnotatedNode<es.AssignmentExpression>;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.AssignmentExpression>);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class DifferentAssignmentError implements SourceError {
    node: TypeAnnotatedNode<es.AssignmentExpression>;
    expectedType: Type;
    receivedType: Type;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.AssignmentExpression>, expectedType: Type, receivedType: Type);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class CyclicReferenceError implements SourceError {
    node: TypeAnnotatedNode<es.Node>;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.Node>);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class DifferentNumberArgumentsError implements SourceError {
    node: TypeAnnotatedNode<es.Node>;
    numExpectedArgs: number;
    numReceived: number;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.Node>, numExpectedArgs: number, numReceived: number);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class InvalidArgumentTypesError implements SourceError {
    node: TypeAnnotatedNode<es.Node>;
    args: TypeAnnotatedNode<es.Node>[];
    expectedTypes: Type[];
    receivedTypes: Type[];
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.Node>, args: TypeAnnotatedNode<es.Node>[], expectedTypes: Type[], receivedTypes: Type[]);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class InvalidTestConditionError implements SourceError {
    node: TypeAnnotatedNode<es.IfStatement | es.ConditionalExpression | es.WhileStatement | es.ForStatement>;
    receivedType: Type;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.IfStatement | es.ConditionalExpression | es.WhileStatement | es.ForStatement>, receivedType: Type);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class UndefinedIdentifierError implements SourceError {
    node: TypeAnnotatedNode<es.Identifier>;
    name: string;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.Identifier>, name: string);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class ConsequentAlternateMismatchError implements SourceError {
    node: TypeAnnotatedNode<es.IfStatement | es.ConditionalExpression>;
    consequentType: Type;
    alternateType: Type;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.IfStatement | es.ConditionalExpression>, consequentType: Type, alternateType: Type);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class CallingNonFunctionType implements SourceError {
    node: TypeAnnotatedNode<es.CallExpression>;
    callerType: Type;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.CallExpression>, callerType: Type);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
export declare class InconsistentPredicateTestError implements SourceError {
    node: TypeAnnotatedNode<es.CallExpression>;
    argVarName: string;
    preUnifyType: Type;
    predicateType: Type;
    type: ErrorType;
    severity: ErrorSeverity;
    constructor(node: TypeAnnotatedNode<es.CallExpression>, argVarName: string, preUnifyType: Type, predicateType: Type);
    get location(): es.SourceLocation;
    explain(): string;
    elaborate(): string;
}
