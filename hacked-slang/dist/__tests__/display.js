"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("../utils/testing");
test('display throw error if second argument is non-string when used', () => {
    return (0, testing_1.expectParsedError)(`display(31072020, 0xDEADC0DE);`).toMatchInlineSnapshot(`"Line 1: TypeError: display expects the second argument to be a string"`);
});
test('display second argument can be a string', () => {
    return (0, testing_1.expectDisplayResult)(`display(31072020, "my_first_String");`, { native: true })
        .toMatchInlineSnapshot(`
            Array [
              "my_first_String 31072020",
            ]
          `);
});
test('display can be used to display numbers', () => {
    return (0, testing_1.expectDisplayResult)(`display(0);`, { native: true }).toMatchInlineSnapshot(`
Array [
  "0",
]
`);
});
test('display can be used to display funny numbers', () => {
    return (0, testing_1.expectDisplayResult)(`display(1e38); display(NaN); display(Infinity);`, { native: true })
        .toMatchInlineSnapshot(`
Array [
  "1e+38",
  "NaN",
  "Infinity",
]
`);
});
test('display can be used to display (escaped) strings', () => {
    return (0, testing_1.expectDisplayResult)(`display("Tom's assisstant said: \\"tuna.\\"");`, { native: true })
        .toMatchInlineSnapshot(`
Array [
  "\\"Tom's assisstant said: \\\\\\"tuna.\\\\\\"\\"",
]
`);
});
test('raw_display can be used to display (unescaped) strings directly', () => {
    return (0, testing_1.expectDisplayResult)(`raw_display("Tom's assisstant said: \\"tuna.\\"");`, { native: true })
        .toMatchInlineSnapshot(`
Array [
  "Tom's assisstant said: \\"tuna.\\"",
]
`);
});
test('display can be used to display functions', () => {
    return (0, testing_1.expectDisplayResult)(`display(x => x); display((x, y) => x + y);`).toMatchInlineSnapshot(`
Array [
  "x => x",
  "(x, y) => x + y",
]
`);
});
test('display can be used to display lists', () => {
    return (0, testing_1.expectDisplayResult)(`display(list(1, 2));`, { chapter: 2, native: true })
        .toMatchInlineSnapshot(`
Array [
  "[1, [2, null]]",
]
`);
});
test('display can be used to display arrays', () => {
    return (0, testing_1.expectDisplayResult)(`display([1, 2, [4, 5]]);`, { chapter: 3, native: true })
        .toMatchInlineSnapshot(`
Array [
  "[1, 2, [4, 5]]",
]
`);
});
test('display can be used to display objects', () => {
    return (0, testing_1.expectDisplayResult)(`display({a: 1, b: 2, c: {d: 3}});`, { chapter: 100 })
        .toMatchInlineSnapshot(`
Array [
  "{\\"a\\": 1, \\"b\\": 2, \\"c\\": {\\"d\\": 3}}",
]
`);
});
test('display with no arguments throws an error', () => {
    return (0, testing_1.expectParsedError)(`display();`, { chapter: 100 }).toMatchInlineSnapshot(`"Line 1: Expected 1 or more arguments, but got 0."`);
});
//# sourceMappingURL=display.js.map