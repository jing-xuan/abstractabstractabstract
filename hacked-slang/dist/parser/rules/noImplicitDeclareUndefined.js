"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoImplicitDeclareUndefinedError = void 0;
const types_1 = require("../../types");
const formatters_1 = require("../../utils/formatters");
class NoImplicitDeclareUndefinedError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return 'Missing value in variable declaration.';
    }
    elaborate() {
        return (0, formatters_1.stripIndent) `
      A variable declaration assigns a value to a name.
      For instance, to assign 20 to ${this.node.name}, you can write:

        let ${this.node.name} = 20;

        ${this.node.name} + ${this.node.name}; // 40
    `;
    }
}
exports.NoImplicitDeclareUndefinedError = NoImplicitDeclareUndefinedError;
const noImplicitDeclareUndefined = {
    name: 'no-implicit-declare-undefined',
    checkers: {
        VariableDeclaration(node, ancestors) {
            const errors = [];
            for (const decl of node.declarations) {
                if (!decl.init) {
                    errors.push(new NoImplicitDeclareUndefinedError(decl.id));
                }
            }
            return errors;
        }
    }
};
exports.default = noImplicitDeclareUndefined;
//# sourceMappingURL=noImplicitDeclareUndefined.js.map