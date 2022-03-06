"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InconsistentPredicateTestError = exports.CallingNonFunctionType = exports.ConsequentAlternateMismatchError = exports.UndefinedIdentifierError = exports.InvalidTestConditionError = exports.InvalidArgumentTypesError = exports.DifferentNumberArgumentsError = exports.CyclicReferenceError = exports.DifferentAssignmentError = exports.ReassignConstError = exports.ArrayAssignmentError = exports.InvalidArrayIndexType = void 0;
const astring_1 = require("astring");
const types_1 = require("../types");
const formatters_1 = require("../utils/formatters");
const stringify_1 = require("../utils/stringify");
// tslint:disable:max-classes-per-file
class InvalidArrayIndexType {
    constructor(node, receivedType) {
        this.node = node;
        this.receivedType = receivedType;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return `Expected array index as number, got ${(0, stringify_1.typeToString)(this.receivedType)} instead`;
    }
    elaborate() {
        return this.explain();
    }
}
exports.InvalidArrayIndexType = InvalidArrayIndexType;
class ArrayAssignmentError {
    constructor(node, arrayType, receivedType) {
        this.node = node;
        this.arrayType = arrayType;
        this.receivedType = receivedType;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return (0, formatters_1.stripIndent) `Expected array type: ${(0, stringify_1.typeToString)(this.arrayType)}
    but got: ${(0, stringify_1.typeToString)(this.receivedType)}`;
    }
    elaborate() {
        return this.explain();
    }
}
exports.ArrayAssignmentError = ArrayAssignmentError;
class ReassignConstError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        const [varName] = formatAssignment(this.node);
        return `Reassignment of constant ${varName}`;
    }
    elaborate() {
        return this.explain();
    }
}
exports.ReassignConstError = ReassignConstError;
class DifferentAssignmentError {
    constructor(node, expectedType, receivedType) {
        this.node = node;
        this.expectedType = expectedType;
        this.receivedType = receivedType;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        const [varName, assignmentStr] = formatAssignment(this.node);
        return (0, formatters_1.stripIndent) `
    Expected assignment of ${varName}:
      ${assignmentStr}
    to get a value of type:
      ${(0, stringify_1.typeToString)(this.expectedType)}
    but got a value of type:
      ${(0, stringify_1.typeToString)(this.receivedType)}
    `;
    }
    elaborate() {
        return this.explain();
    }
}
exports.DifferentAssignmentError = DifferentAssignmentError;
function formatAssignment(node) {
    const leftNode = node.left;
    const assignmentStr = (0, formatters_1.simplify)((0, astring_1.generate)(node.right));
    return [leftNode.name, assignmentStr];
}
class CyclicReferenceError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return `${stringifyNode(this.node)} contains cyclic reference to itself`;
    }
    elaborate() {
        return this.explain();
    }
}
exports.CyclicReferenceError = CyclicReferenceError;
function stringifyNode(node) {
    var _a;
    return ['VariableDeclaration', 'FunctionDeclaration'].includes(node.type)
        ? node.type === 'VariableDeclaration'
            ? node.declarations[0].id.name
            : (_a = node.id) === null || _a === void 0 ? void 0 : _a.name
        : node.type === 'Identifier'
            ? node.name
            : JSON.stringify(node); // might not be a good idea
}
class DifferentNumberArgumentsError {
    constructor(node, numExpectedArgs, numReceived) {
        this.node = node;
        this.numExpectedArgs = numExpectedArgs;
        this.numReceived = numReceived;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return `Function expected ${this.numExpectedArgs} args, but got ${this.numReceived}`;
    }
    elaborate() {
        return this.explain();
    }
}
exports.DifferentNumberArgumentsError = DifferentNumberArgumentsError;
class InvalidArgumentTypesError {
    constructor(node, args, expectedTypes, receivedTypes) {
        this.node = node;
        this.args = args;
        this.expectedTypes = expectedTypes;
        this.receivedTypes = receivedTypes;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        const argStrings = this.args.map(arg => (0, formatters_1.simplify)((0, astring_1.generate)(arg)));
        if ('operator' in this.node) {
            const op = this.node.operator;
            if (this.expectedTypes.length === 2) {
                // binary operator
                return (0, formatters_1.stripIndent) `
        A type mismatch was detected in the binary expression:
          ${argStrings[0]} ${op} ${argStrings[1]}
        The binary operator (${op}) expected two operands with types:
          ${(0, stringify_1.typeToString)(this.expectedTypes[0])} ${op} ${(0, stringify_1.typeToString)(this.expectedTypes[1])}
        but instead it received two operands of types:
          ${(0, stringify_1.typeToString)(this.receivedTypes[0])} ${op} ${(0, stringify_1.typeToString)(this.receivedTypes[1])}
        `;
            }
            else {
                // unary operator
                return (0, formatters_1.stripIndent) `
        A type mismatch was detected in the unary expression:
          ${op} ${argStrings[0]}
        The unary operator (${op}) expected its operand to be of type:
          ${(0, stringify_1.typeToString)(this.expectedTypes[0])}
        but instead it received an operand of type:
          ${(0, stringify_1.typeToString)(this.receivedTypes[0])}
        `;
            }
        }
        const functionString = (0, formatters_1.simplify)((0, astring_1.generate)(this.node));
        function formatPhrasing(types) {
            switch (types.length) {
                // there will at least be one argument
                case 1:
                    return `an argument of type:
      ${(0, stringify_1.typeToString)(types[0])}`;
                default:
                    return `${types.length} arguments of types:
      ${types.map(stringify_1.typeToString).join(', ')}`;
            }
        }
        return (0, formatters_1.stripIndent) `
    A type mismatch was detected in the function call:
      ${functionString}
    The function expected ${formatPhrasing(this.expectedTypes)}
    but instead received ${formatPhrasing(this.receivedTypes)}
    `;
    }
    elaborate() {
        return this.explain();
    }
}
exports.InvalidArgumentTypesError = InvalidArgumentTypesError;
function formatNodeWithTest(node) {
    let exprString = (0, formatters_1.simplify)((0, astring_1.generate)(node.test));
    let kind;
    switch (node.type) {
        case 'IfStatement': {
            exprString = `if (${exprString}) { ... } else { ... }`;
            kind = 'if statement';
            break;
        }
        case 'ConditionalExpression': {
            exprString = `${exprString} ? ... : ...`;
            kind = 'conditional expression';
            break;
        }
        case 'WhileStatement': {
            exprString = `while (${exprString}) { ... }`;
            kind = 'while statement';
            break;
        }
        case 'ForStatement': {
            exprString = `for (...; ${exprString}; ...) { ... }`;
            kind = 'for statement';
        }
    }
    return { exprString, kind };
}
class InvalidTestConditionError {
    constructor(node, receivedType) {
        this.node = node;
        this.receivedType = receivedType;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        const { exprString, kind } = formatNodeWithTest(this.node);
        return (0, formatters_1.stripIndent) `
    Expected the test part of the ${kind}:
      ${exprString}
    to have type boolean, but instead it is type:
      ${(0, stringify_1.typeToString)(this.receivedType)}
    `;
    }
    elaborate() {
        return this.explain();
    }
}
exports.InvalidTestConditionError = InvalidTestConditionError;
class UndefinedIdentifierError {
    constructor(node, name) {
        this.node = node;
        this.name = name;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return (0, formatters_1.stripIndent) `
    One or more undeclared names detected (e.g. '${this.name}').
    If there aren't actually any undeclared names, then is either a Source or misconfiguration bug.
    Please report this to the administrators!
    `;
    }
    elaborate() {
        return this.explain();
    }
}
exports.UndefinedIdentifierError = UndefinedIdentifierError;
class ConsequentAlternateMismatchError {
    constructor(node, consequentType, alternateType) {
        this.node = node;
        this.consequentType = consequentType;
        this.alternateType = alternateType;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        const { exprString, kind } = formatNodeWithTest(this.node);
        return (0, formatters_1.stripIndent) `
    The two branches of the ${kind}:
      ${exprString}
    produce different types!
    The true branch has type:
      ${(0, stringify_1.typeToString)(this.consequentType)}
    but the false branch has type:
      ${(0, stringify_1.typeToString)(this.alternateType)}
    `;
    }
    elaborate() {
        return this.explain();
    }
}
exports.ConsequentAlternateMismatchError = ConsequentAlternateMismatchError;
class CallingNonFunctionType {
    constructor(node, callerType) {
        this.node = node;
        this.callerType = callerType;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return (0, formatters_1.stripIndent) `
    In
      ${(0, formatters_1.simplify)((0, astring_1.generate)(this.node))}
    expected
      ${(0, formatters_1.simplify)((0, astring_1.generate)(this.node.callee))}
    to be a function type, but instead it is type:
      ${(0, stringify_1.typeToString)(this.callerType)}
    `;
    }
    elaborate() {
        return this.explain();
    }
}
exports.CallingNonFunctionType = CallingNonFunctionType;
class InconsistentPredicateTestError {
    constructor(node, argVarName, preUnifyType, predicateType) {
        this.node = node;
        this.argVarName = argVarName;
        this.preUnifyType = preUnifyType;
        this.predicateType = predicateType;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        const exprString = (0, astring_1.generate)(this.node);
        return (0, formatters_1.stripIndent) `
    Inconsistent type constraints when trying to apply the predicate test
      ${exprString}
    It is inconsistent with the predicate tests applied before it.
    The variable ${this.argVarName} has type
      ${(0, stringify_1.typeToString)(this.preUnifyType)}
    but could not unify with type
      ${(0, stringify_1.typeToString)(this.predicateType)}
    `;
    }
    elaborate() {
        return this.explain();
    }
}
exports.InconsistentPredicateTestError = InconsistentPredicateTestError;
//# sourceMappingURL=typeErrors.js.map