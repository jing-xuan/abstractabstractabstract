"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoHolesInArrays = void 0;
const types_1 = require("../../types");
const formatters_1 = require("../../utils/formatters");
class NoHolesInArrays {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return `No holes are allowed in array literals.`;
    }
    elaborate() {
        return (0, formatters_1.stripIndent) `
      No holes (empty slots with no content inside) are allowed in array literals.
      You probably have an extra comma, which creates a hole.
    `;
    }
}
exports.NoHolesInArrays = NoHolesInArrays;
const noHolesInArrays = {
    name: 'no-holes-in-arrays',
    checkers: {
        ArrayExpression(node) {
            return node.elements.some(x => x === null) ? [new NoHolesInArrays(node)] : [];
        }
    }
};
exports.default = noHolesInArrays;
//# sourceMappingURL=noHolesInArrays.js.map