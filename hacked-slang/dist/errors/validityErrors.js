"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoAssignmentToForVariable = void 0;
const types_1 = require("../types");
class NoAssignmentToForVariable {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return 'Assignment to a for loop variable in the for loop is not allowed.';
    }
    elaborate() {
        return this.explain();
    }
}
exports.NoAssignmentToForVariable = NoAssignmentToForVariable;
//# sourceMappingURL=validityErrors.js.map