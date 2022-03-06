"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDotAbbreviationError = void 0;
const types_1 = require("../../types");
class NoDotAbbreviationError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return 'Dot abbreviations are not allowed.';
    }
    elaborate() {
        return `Source doesn't use object-oriented programming, so you don't need any dots in your code (except decimal \
        points in numbers).`;
    }
}
exports.NoDotAbbreviationError = NoDotAbbreviationError;
const noDotAbbreviation = {
    name: 'no-dot-abbreviation',
    disableOn: 100,
    checkers: {
        MemberExpression(node, ancestors) {
            if (!node.computed) {
                return [new NoDotAbbreviationError(node)];
            }
            else {
                return [];
            }
        }
    }
};
exports.default = noDotAbbreviation;
//# sourceMappingURL=noDotAbbreviation.js.map