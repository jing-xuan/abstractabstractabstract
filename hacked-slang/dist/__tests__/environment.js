"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interpreter_1 = require("../interpreter/interpreter");
const context_1 = require("../mocks/context");
const parser_1 = require("../parser/parser");
const formatters_1 = require("../utils/formatters");
test('Function params and body identifiers are in different environment', () => {
    const code = (0, formatters_1.stripIndent) `
  function f(x) {
    const y = 1;
    // 13 steps to evaluate until here
    return x;
  }
  f(2);
  `;
    const context = (0, context_1.mockContext)(4);
    context.prelude = null; // hide the unneeded prelude
    const parsed = (0, parser_1.parse)(code, context);
    const it = (0, interpreter_1.evaluate)(parsed, context);
    const stepsToComment = 13; // manually counted magic number
    for (let i = 0; i < stepsToComment; i += 1) {
        it.next();
    }
    context.runtime.environments.forEach(environment => {
        expect(environment).toMatchSnapshot({
            id: expect.any(String)
        });
    });
    expect(context.runtime.environments[0].head).toMatchObject({ y: 1 });
});
//# sourceMappingURL=environment.js.map