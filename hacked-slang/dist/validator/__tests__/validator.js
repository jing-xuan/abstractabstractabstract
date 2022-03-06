"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toValidatedAst = void 0;
const context_1 = require("../../mocks/context");
const parser_1 = require("../../parser/parser");
const astCreator_1 = require("../../utils/astCreator");
const formatters_1 = require("../../utils/formatters");
const testing_1 = require("../../utils/testing");
const walkers_1 = require("../../utils/walkers");
const validator_1 = require("../validator");
function toValidatedAst(code) {
    const context = (0, context_1.mockContext)(1);
    const ast = (0, parser_1.parse)(code, context);
    expect(ast).not.toBeUndefined();
    return (0, validator_1.validateAndAnnotate)(ast, context);
}
exports.toValidatedAst = toValidatedAst;
test('for loop variable cannot be reassigned', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, formatters_1.stripIndent) `
    for (let i = 0; i < 10; i = i + 1) {
      i = 10;
    }
  `;
    return (0, testing_1.expectParsedError)(code, { chapter: 4 }).toMatchInlineSnapshot(`"Line 2: Assignment to a for loop variable in the for loop is not allowed."`);
}));
test('for loop variable cannot be reassigned in closure', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, formatters_1.stripIndent) `
    for (let i = 0; i < 10; i = i + 1) {
      function f() {
        i = 10;
      }
    }
  `;
    return (0, testing_1.expectParsedError)(code, { chapter: 4 }).toMatchInlineSnapshot(`"Line 3: Assignment to a for loop variable in the for loop is not allowed."`);
}));
test('testing typability', () => {
    const code = (0, formatters_1.stripIndent) `
    const a = 1; // typable
    function f() { // typable
      c;
      return f();
    }
    const b = f(); // typable
    function g() { // not typable
    }
    const c = 1; // not typable
  `;
    const ast = toValidatedAst(code);
    expect(ast).toMatchSnapshot();
    (0, walkers_1.simple)(ast, {
        VariableDeclaration(node) {
            let expectedTypability = '';
            switch ((0, astCreator_1.getVariableDecarationName)(node)) {
                case 'a':
                case 'b':
                    expectedTypability = 'NotYetTyped';
                    break;
                case 'c':
                    expectedTypability = 'Untypable';
            }
            expect(node.typability).toBe(expectedTypability);
        },
        FunctionDeclaration(node) {
            let expectedTypability = '';
            switch (node.id.name) {
                case 'f':
                    expectedTypability = 'NotYetTyped';
                    break;
                case 'g':
                    expectedTypability = 'Untypable';
            }
            expect(node.typability).toBe(expectedTypability);
        }
    });
});
//# sourceMappingURL=validator.js.map