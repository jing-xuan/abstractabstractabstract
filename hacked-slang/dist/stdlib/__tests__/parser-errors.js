"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatters_1 = require("../../utils/formatters");
const testing_1 = require("../../utils/testing");
test('Blatant syntax error', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    stringify(parse("'"), undefined, 2);
    `, { chapter: 4 }).toMatchInlineSnapshot(`"Line 1: ParseError: SyntaxError: Unterminated string constant (1:0)"`);
});
test('Blacklisted syntax', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    stringify(parse("function* f() { yield 1; } f();"), undefined, 2);
    `, { chapter: 4 }).toMatchInlineSnapshot(`"Line 1: ParseError: Yield expressions are not allowed"`);
});
//# sourceMappingURL=parser-errors.js.map