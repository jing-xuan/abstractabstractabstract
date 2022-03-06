"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../mocks/context");
const parser_1 = require("../../parser/parser");
const formatters_1 = require("../../utils/formatters");
const transpiler_1 = require("../transpiler");
/*  DO NOT HAVE 'native[<digit>]' AS A SUBSTRING IN CODE STRINGS ANYWHERE IN THIS FILE!
 *  Some code here have a redundant '1;' as the last statement to prevent the
 *  code being tested from being transformed into eval.
 *  Check for variables being stored back by looking at all the tests.
 */
test('builtins do get prepended', () => {
    const code = '"ensure_builtins";';
    const context = (0, context_1.mockContext)(4);
    const transpiled = (0, transpiler_1.transpile)((0, parser_1.parse)(code, context), context).transpiled;
    // replace native[<number>] as they may be inconsistent
    const replacedNative = transpiled.replace(/native\[\d+]/g, 'native');
    // replace the line hiding globals as they may differ between environments
    const replacedGlobalsLine = replacedNative.replace(/\n\(\(.*\)/, '\n(( <globals redacted> )');
    expect({ code, transpiled: replacedGlobalsLine }).toMatchSnapshot();
});
test('Ensure no name clashes', () => {
    const code = (0, formatters_1.stripIndent) `
    const boolOrErr = 1;
    boolOrErr[123] = 1;
    function f(callIfFuncAndRightArgs, wrap0, wrap1, wrap2,
      wrap3, wrap4, wrap5, wrap6, wrap7, wrap8, wrap9) {
      let wrap = 2;
      wrap0;wrap1;wrap2;wrap3;wrap4;wrap5;wrap6;wrap7;wrap8;wrap9;
    }
    const native = 123;
  `;
    const context = (0, context_1.mockContext)(4);
    const transpiled = (0, transpiler_1.transpile)((0, parser_1.parse)(code, context), context).transpiled;
    const replacedNative = transpiled.replace(/native0\[\d+]/g, 'native');
    const replacedGlobalsLine = replacedNative.replace(/\n\(\(.*\)/, '\n(( <globals redacted> )');
    expect(replacedGlobalsLine).toMatchSnapshot();
});
//# sourceMappingURL=transpiled-code.js.map