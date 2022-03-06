"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoIfWithoutElseError = void 0;
const astring_1 = require("astring");
const types_1 = require("../../types");
const formatters_1 = require("../../utils/formatters");
class NoIfWithoutElseError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return 'Missing "else" in "if-else" statement.';
    }
    elaborate() {
        return (0, formatters_1.stripIndent) `
      This "if" block requires corresponding "else" block which will be
      evaluated when ${(0, astring_1.generate)(this.node.test)} expression evaluates to false.

      Later in the course we will lift this restriction and allow "if" without
      else.
    `;
    }
}
exports.NoIfWithoutElseError = NoIfWithoutElseError;
const noIfWithoutElse = {
    name: 'no-if-without-else',
    disableOn: 3,
    checkers: {
        IfStatement(node, ancestors) {
            if (!node.alternate) {
                return [new NoIfWithoutElseError(node)];
            }
            else {
                return [];
            }
        }
    }
};
exports.default = noIfWithoutElse;
//# sourceMappingURL=noIfWithoutElse.js.map