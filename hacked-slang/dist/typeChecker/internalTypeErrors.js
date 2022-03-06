"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalCyclicReferenceError = exports.InternalDifferentNumberArgumentsError = exports.UnifyError = exports.InternalTypeError = exports.TypeError = void 0;
const types_1 = require("../types");
const stringify_1 = require("../utils/stringify");
// tslint:disable:max-classes-per-file
class TypeError {
    constructor(node, message) {
        this.node = node;
        this.message = message;
        this.type = types_1.ErrorType.TYPE;
        this.severity = types_1.ErrorSeverity.WARNING;
        node.typability = 'Untypable';
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return this.message;
    }
    elaborate() {
        return this.message;
    }
}
exports.TypeError = TypeError;
/**
 * Temporary error that will eventually be converted to TypeError as some errors are only thrown
 * where there is no handle to the node
 */
class InternalTypeError extends Error {
    // constructor(public message: string, ...params: any[]) {
    //   super(...params)
    // }
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.InternalTypeError = InternalTypeError;
class UnifyError extends InternalTypeError {
    constructor(LHS, RHS) {
        super(`Failed to unify LHS: ${(0, stringify_1.typeToString)(LHS)}, RHS: ${(0, stringify_1.typeToString)(RHS)}`);
        this.LHS = LHS;
        this.RHS = RHS;
    }
}
exports.UnifyError = UnifyError;
class InternalDifferentNumberArgumentsError extends InternalTypeError {
    constructor(numExpectedArgs, numReceived) {
        super(`Expected ${numExpectedArgs} args, got ${numReceived}`);
        this.numExpectedArgs = numExpectedArgs;
        this.numReceived = numReceived;
    }
}
exports.InternalDifferentNumberArgumentsError = InternalDifferentNumberArgumentsError;
class InternalCyclicReferenceError extends InternalTypeError {
    constructor(name) {
        super(`contains a cyclic reference to itself`);
        this.name = name;
    }
}
exports.InternalCyclicReferenceError = InternalCyclicReferenceError;
//# sourceMappingURL=internalTypeErrors.js.map