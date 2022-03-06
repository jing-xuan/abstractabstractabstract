"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForStatmentMustHaveAllParts = void 0;
const types_1 = require("../../types");
const formatters_1 = require("../../utils/formatters");
class ForStatmentMustHaveAllParts {
    constructor(node, missingParts) {
        this.node = node;
        this.missingParts = missingParts;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return `Missing ${this.missingParts.join(', ')} expression${this.missingParts.length === 1 ? '' : 's'} in for statement.`;
    }
    elaborate() {
        return (0, formatters_1.stripIndent) `
      This for statement requires all three parts (initialiser, test, update) to be present.
    `;
    }
}
exports.ForStatmentMustHaveAllParts = ForStatmentMustHaveAllParts;
const forStatementMustHaveAllParts = {
    name: 'for-statement-must-have-all-parts',
    checkers: {
        ForStatement(node) {
            const missingParts = ['init', 'test', 'update'].filter(part => node[part] === null);
            if (missingParts.length > 0) {
                return [new ForStatmentMustHaveAllParts(node, missingParts)];
            }
            else {
                return [];
            }
        }
    }
};
exports.default = forStatementMustHaveAllParts;
//# sourceMappingURL=forStatementMustHaveAllParts.js.map