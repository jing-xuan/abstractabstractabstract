"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatters_1 = require("../../utils/formatters");
const testing_1 = require("../../utils/testing");
test('tokenize works for a good program', () => {
    return (0, testing_1.expectDisplayResult)('display_list(tokenize(' +
        JSON.stringify((0, formatters_1.stripIndent) `
      function f(x) {
        const y = x + x + x + "123";
        return z => (a, b) => {
          let w = z + 1;
          return y;
        };
      }
      f("55");
      `) +
        '));', { chapter: 4 }).toMatchInlineSnapshot(`
            Array [
              "list(\\"function\\",
                 \\"f\\",
                 \\"(\\",
                 \\"x\\",
                 \\")\\",
                 \\"{\\",
                 \\"const\\",
                 \\"y\\",
                 \\"=\\",
                 \\"x\\",
                 \\"+\\",
                 \\"x\\",
                 \\"+\\",
                 \\"x\\",
                 \\"+\\",
                 \\"\\\\\\"123\\\\\\"\\",
                 \\";\\",
                 \\"return\\",
                 \\"z\\",
                 \\"=>\\",
                 \\"(\\",
                 \\"a\\",
                 \\",\\",
                 \\"b\\",
                 \\")\\",
                 \\"=>\\",
                 \\"{\\",
                 \\"let\\",
                 \\"w\\",
                 \\"=\\",
                 \\"z\\",
                 \\"+\\",
                 \\"1\\",
                 \\";\\",
                 \\"return\\",
                 \\"y\\",
                 \\";\\",
                 \\"}\\",
                 \\";\\",
                 \\"}\\",
                 \\"f\\",
                 \\"(\\",
                 \\"\\\\\\"55\\\\\\"\\",
                 \\")\\",
                 \\";\\")",
            ]
          `);
});
test('tokenize works even with parse errors', () => {
    return (0, testing_1.expectDisplayResult)('display_list(tokenize(' +
        JSON.stringify((0, formatters_1.stripIndent) `
      function f(x) {
      ;;;;;;;
      `) +
        '));', { chapter: 4 }).toMatchInlineSnapshot(`
            Array [
              "list(\\"function\\", \\"f\\", \\"(\\", \\"x\\", \\")\\", \\"{\\", \\";\\", \\";\\", \\";\\", \\";\\", \\";\\", \\";\\", \\";\\")",
            ]
          `);
});
test('tokenize prints suitable error when tokenization fails', () => {
    return (0, testing_1.expectParsedError)('display_list(tokenize("\\""));', { chapter: 4 }).toMatchInlineSnapshot(`"Line 1: SyntaxError: Unterminated string constant (1:0)"`);
});
//# sourceMappingURL=tokenize.js.map