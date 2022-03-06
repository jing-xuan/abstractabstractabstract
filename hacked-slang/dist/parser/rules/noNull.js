"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoNullError = void 0;
const types_1 = require("../../types");
class NoNullError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return `null literals are not allowed.`;
    }
    elaborate() {
        return "They're not part of the Source §1 specs.";
    }
}
exports.NoNullError = NoNullError;
const noNull = {
    name: 'no-null',
    disableOn: 2,
    checkers: {
        Literal(node, ancestors) {
            if (node.value === null) {
                return [new NoNullError(node)];
            }
            else {
                return [];
            }
        }
    }
};
exports.default = noNull;
//# sourceMappingURL=noNull.js.map