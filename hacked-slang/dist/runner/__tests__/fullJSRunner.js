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
const __1 = require("../..");
const errors_1 = require("../../errors/errors");
const context_1 = require("../../mocks/context");
const parser_1 = require("../../parser/parser");
const astCreator_1 = require("../../utils/astCreator");
test('Source builtins are accessible in fullJS program', () => __awaiter(void 0, void 0, void 0, function* () {
    const fullJSProgram = `
    parse('head(list(1,2,3));');
    `;
    const fullJSContext = (0, context_1.mockContext)(-1, 'default');
    yield (0, __1.runInContext)(fullJSProgram, fullJSContext);
    expect(fullJSContext.errors.length).toBeLessThanOrEqual(0);
}));
test('Simulate fullJS REPL', () => __awaiter(void 0, void 0, void 0, function* () {
    const fullJSContext = (0, context_1.mockContext)(-1, 'default');
    const replStatements = [
        ['const x = 1;', undefined],
        ['x;', 1],
        ['const y = x + 1;', undefined],
        ['y;', 2]
    ];
    for (const replStatement of replStatements) {
        const [statement, expectedResult] = replStatement;
        const result = yield (0, __1.runInContext)(statement, fullJSContext);
        expect(result.status).toStrictEqual('finished');
        expect(result.value).toStrictEqual(expectedResult);
        expect(fullJSContext.errors).toStrictEqual([]);
    }
}));
describe('Native javascript programs are valid in fullJSRunner', () => {
    const LITERAL_OBJECT = {
        name: 'LITERAL OBJECT',
        snippet: `
          const sourceLanguage = {
              chapter: 1,
              variant: "default",
              displayName: "Source 1"
          }
          sourceLanguage["displayName"];
          `,
        value: 'Source 1',
        errors: []
    };
    const OOP = {
        name: 'OOP',
        snippet: `
          class Rectangle {
              constructor(height, width) {
                this.height = height;
                this.width = width;
              }
          }
          const rect1 = new Rectangle(1080, 1920);
          rect1.height;
          `,
        value: 1080,
        errors: []
    };
    const ARRAY_MAP = {
        name: 'ARRAY MAP',
        snippet: `
          [1,2,3,4].map(num => num + 1);
          `,
        value: [2, 3, 4, 5],
        errors: []
    };
    const ARRAY_FILTER = {
        name: 'ARRAY FILTER',
        snippet: `
          [1,2,3,4].filter(num => num > 2);
          `,
        value: [3, 4],
        errors: []
    };
    it.each([LITERAL_OBJECT, OOP, ARRAY_FILTER, ARRAY_MAP, OOP])(`%p`, ({ snippet, value, errors }) => __awaiter(void 0, void 0, void 0, function* () {
        const fullJSContext = (0, context_1.mockContext)(-1, 'default');
        const result = yield (0, __1.runInContext)(snippet, fullJSContext);
        expect(result.status).toStrictEqual('finished');
        expect(result.value).toStrictEqual(value);
        expect(fullJSContext.errors).toStrictEqual(errors);
    }));
});
describe('Error locations are handled well in fullJS', () => {
    const UNDEFINED_VARIABLE = {
        name: 'UNDEFINED VARIABLE',
        snippet: `
          const a = b;
          `,
        value: undefined,
        errors: [new errors_1.UndefinedVariable('b', (0, astCreator_1.locationDummyNode)(2, 20))]
    };
    const SYNTAX_ERROR = {
        name: 'SYNTAX ERROR',
        snippet: `function(){}`,
        value: undefined,
        errors: [
            new parser_1.FatalSyntaxError({ start: { line: 1, column: 8 }, end: { line: 1, column: 9 } }, 'SyntaxError: Unexpected token (1:8)')
        ]
    };
    it.each([UNDEFINED_VARIABLE, SYNTAX_ERROR])(`%p`, ({ snippet, value, errors }) => __awaiter(void 0, void 0, void 0, function* () {
        const fullJSContext = (0, context_1.mockContext)(-1, 'default');
        const result = yield (0, __1.runInContext)(snippet, fullJSContext);
        expect(result.status).toStrictEqual('error');
        expect(result.value).toStrictEqual(value);
        expect(fullJSContext.errors).toStrictEqual(errors);
    }));
});
//# sourceMappingURL=fullJSRunner.js.map