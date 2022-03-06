"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoTemplateExpressionError = void 0;
const types_1 = require("../../types");
class NoTemplateExpressionError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return 'Expressions are not allowed in template literals (`multiline strings`)';
    }
    elaborate() {
        return this.explain();
    }
}
exports.NoTemplateExpressionError = NoTemplateExpressionError;
const noTemplateExpression = {
    name: 'no-template-expression',
    checkers: {
        TemplateLiteral(node, ancestors) {
            if (node.expressions.length > 0) {
                return [new NoTemplateExpressionError(node)];
            }
            else {
                return [];
            }
        }
    }
};
exports.default = noTemplateExpression;
//# sourceMappingURL=noTemplateExpression.js.map