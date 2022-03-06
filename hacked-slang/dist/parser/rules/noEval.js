"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoEval = void 0;
const types_1 = require("../../types");
class NoEval {
    constructor(node) {
        this.node = node;
        this.type = types_1.ErrorType.SYNTAX;
        this.severity = types_1.ErrorSeverity.ERROR;
    }
    get location() {
        return this.node.loc;
    }
    explain() {
        return `eval is not allowed.`;
    }
    elaborate() {
        return this.explain();
    }
}
exports.NoEval = NoEval;
const noEval = {
    name: 'no-eval',
    checkers: {
        Identifier(node, ancestors) {
            if (node.name === 'eval') {
                return [new NoEval(node)];
            }
            else {
                return [];
            }
        }
    }
};
exports.default = noEval;
//# sourceMappingURL=noEval.js.map