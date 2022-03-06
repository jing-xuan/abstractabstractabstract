"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleDeclarationsError = void 0;
const astring_1 = require("astring");
const types_1 = require("../../types");
class MultipleDeclarationsError {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
        this.fixs = node.declarations.map(declaration => ({
            type: 'VariableDeclaration',
            kind: 'let',
            loc: declaration.loc,
            declarations: [declaration]
        }));
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return 'Multiple declaration in a single statement.';
    }
    elaborate() {
        const fixs = this.fixs.map(n => '\t' + (0, astring_1.generate)(n)).join('\n');
        return 'Split the variable declaration into multiple lines as follows\n\n' + fixs + '\n';
    }
}
exports.MultipleDeclarationsError = MultipleDeclarationsError;
const singleVariableDeclaration = {
    name: 'single-variable-declaration',
    checkers: {
        VariableDeclaration(node, ancestors) {
            if (node.declarations.length > 1) {
                return [new MultipleDeclarationsError(node)];
            }
            else {
                return [];
            }
        }
    }
};
exports.default = singleVariableDeclaration;
//# sourceMappingURL=singleVariableDeclaration.js.map