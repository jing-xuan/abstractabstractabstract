"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatters_1 = require("../utils/formatters");
const stringify_1 = require("../utils/stringify");
const testing_1 = require("../utils/testing");
test('String representation of numbers are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(0);
  `, { native: true }).toMatchInlineSnapshot(`"0"`);
});
test('String representation of strings are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify('a string');
  `, { native: true }).toMatchInlineSnapshot(`"\\"a string\\""`);
});
test('String representation of booleans are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify('true');
  `, { native: true }).toMatchInlineSnapshot(`"\\"true\\""`);
});
test('String representation of functions are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  function f(x, y) {
    return x;
  }
  stringify(f);
  `, { native: true }).toMatchInlineSnapshot(`
            "function f(x, y) {
              return x;
            }"
          `);
});
test('String representation of arrow functions are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const f = (x, y) => x;
  stringify(f);
  `, { native: true }).toMatchInlineSnapshot(`"(x, y) => x"`);
});
test('String representation of arrays are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const xs = [1, 'true', true, () => 1];
  stringify(xs);
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"[1, \\"true\\", true, () => 1]"`);
});
test('String representation of multidimensional arrays are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const xs = [1, 'true', [true, () => 1, [[]]]];
  stringify(xs);
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"[1, \\"true\\", [true, () => 1, [[]]]]"`);
});
test('String representation of empty arrays are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const xs = [];
  stringify(xs);
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"[]"`);
});
test('String representation of lists are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(enum_list(1, 10));
  `, { chapter: 2, native: true }).toMatchInlineSnapshot(`"[1, [2, [3, [4, [5, [6, [7, [8, [9, [10, null]]]]]]]]]]"`);
});
test('Correctly handles circular structures with multiple entry points', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const x = enum_list(1, 3);
  set_tail(tail(tail(x)), x);
  stringify(list(x, tail(x), tail(tail(x))));
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`
            "[ [1, [2, [3, ...<circular>]]],
            [[2, [3, [1, ...<circular>]]], [[3, [1, [2, ...<circular>]]], null]]]"
          `);
});
// The interpreter runs into a MaximumStackLimitExceeded error on 1000, so reduced it to 100.
// tslint:disable:max-line-length
test('String representation of huge lists are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(enum_list(1, 100));
  `, { chapter: 2, native: true }).toMatchInlineSnapshot(`
            "[ 1,
            [ 2,
            [ 3,
            [ 4,
            [ 5,
            [ 6,
            [ 7,
            [ 8,
            [ 9,
            [ 10,
            [ 11,
            [ 12,
            [ 13,
            [ 14,
            [ 15,
            [ 16,
            [ 17,
            [ 18,
            [ 19,
            [ 20,
            [ 21,
            [ 22,
            [ 23,
            [ 24,
            [ 25,
            [ 26,
            [ 27,
            [ 28,
            [ 29,
            [ 30,
            [ 31,
            [ 32,
            [ 33,
            [ 34,
            [ 35,
            [ 36,
            [ 37,
            [ 38,
            [ 39,
            [ 40,
            [ 41,
            [ 42,
            [ 43,
            [ 44,
            [ 45,
            [ 46,
            [ 47,
            [ 48,
            [ 49,
            [ 50,
            [ 51,
            [ 52,
            [ 53,
            [ 54,
            [ 55,
            [ 56,
            [ 57,
            [ 58,
            [ 59,
            [ 60,
            [ 61,
            [ 62,
            [ 63,
            [ 64,
            [ 65,
            [ 66,
            [ 67,
            [ 68,
            [ 69,
            [ 70,
            [ 71,
            [ 72,
            [ 73,
            [ 74,
            [ 75,
            [ 76,
            [ 77,
            [ 78,
            [ 79,
            [ 80,
            [ 81,
            [ 82,
            [ 83,
            [ 84,
            [ 85,
            [ 86,
            [ 87,
            [ 88,
            [89, [90, [91, [92, [93, [94, [95, [96, [97, [98, [99, [100, null]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]"
          `);
});
// tslint:enable:max-line-length
test('String representation of huge arrays are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const arr = [];
  for (let i = 0; i < 100; i = i + 1) {
    arr[i] = i;
  }
  stringify(arr);
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`
            "[ 0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23,
              24,
              25,
              26,
              27,
              28,
              29,
              30,
              31,
              32,
              33,
              34,
              35,
              36,
              37,
              38,
              39,
              40,
              41,
              42,
              43,
              44,
              45,
              46,
              47,
              48,
              49,
              50,
              51,
              52,
              53,
              54,
              55,
              56,
              57,
              58,
              59,
              60,
              61,
              62,
              63,
              64,
              65,
              66,
              67,
              68,
              69,
              70,
              71,
              72,
              73,
              74,
              75,
              76,
              77,
              78,
              79,
              80,
              81,
              82,
              83,
              84,
              85,
              86,
              87,
              88,
              89,
              90,
              91,
              92,
              93,
              94,
              95,
              96,
              97,
              98,
              99]"
          `);
});
test('String representation of objects are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const o = { a: 1, b: true, c: () => 1 };
  stringify(o);
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"{\\"a\\": 1, \\"b\\": true, \\"c\\": () => 1}"`);
});
test('String representation of objects with toReplString member calls toReplString', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const o = { toReplString: () => '<RUNE>' };
  stringify(o);
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"<RUNE>"`);
});
test('String representation of nested objects are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const o = { a: 1, b: true, c: () => 1, d: { e: 5, f: 6 } };
  stringify(o);
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"{\\"a\\": 1, \\"b\\": true, \\"c\\": () => 1, \\"d\\": {\\"e\\": 5, \\"f\\": 6}}"`);
});
test('String representation of big objects are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  const o = { a: 1, b: true, c: () => 1, d: { e: 5, f: 6 }, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0, n: 0};
  stringify(o);
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`
            "{ \\"a\\": 1,
              \\"b\\": true,
              \\"c\\": () => 1,
              \\"d\\": {\\"e\\": 5, \\"f\\": 6},
              \\"g\\": 0,
              \\"h\\": 0,
              \\"i\\": 0,
              \\"j\\": 0,
              \\"k\\": 0,
              \\"l\\": 0,
              \\"m\\": 0,
              \\"n\\": 0}"
          `);
});
test('String representation of nested objects are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  let o = {};
  o.o = o;
  stringify(o);
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"{\\"o\\": ...<circular>}"`);
});
test('String representation of non literal objects is nice', () => {
    const errorMsg = 'This is an error';
    const errorObj = new Error(errorMsg);
    return expect((0, stringify_1.stringify)(errorObj)).toMatchInlineSnapshot(`"${errorObj.toString()}"`);
});
test('String representation of non literal objects in nested object is nice', () => {
    const errorMsg = 'This is an error';
    const errorObj = new Error(errorMsg);
    const nestedObj = {
        data: [1, [2, errorObj], 3]
    };
    return expect((0, stringify_1.stringify)(nestedObj)).toMatchInlineSnapshot(`"{\\"data\\": [1, [2, ${errorObj.toString()}], 3]}"`);
});
test('String representation of instances is nice', () => {
    class TestClass {
        constructor(data) {
            this.data = data;
        }
        toString() {
            return `testClass instance: ${this.data}`;
        }
    }
    const testClassInst = new TestClass('test1');
    return expect((0, stringify_1.stringify)(testClassInst)).toMatchInlineSnapshot(`"${testClassInst.toString()}"`);
});
test('String representation of builtins are nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(pair);
  `, { chapter: 2, native: true }).toMatchInlineSnapshot(`
            "function pair(left, right) {
            	[implementation hidden]
            }"
          `);
});
test('String representation of null is nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(null);
  `, { chapter: 2, native: true }).toMatchInlineSnapshot(`"null"`);
});
test('String representation of undefined is nice', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(undefined);
  `, { native: true }).toMatchInlineSnapshot(`"undefined"`);
});
// tslint:disable:max-line-length
test('String representation with no indent', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(parse('x=>x;'), 0);
  `, { chapter: 4, native: true }).toMatchInlineSnapshot(`
            "[\\"lambda_expression\\",
            [[[\\"name\\", [\\"x\\", null]], null],
            [[\\"return_statement\\", [[\\"name\\", [\\"x\\", null]], null]], null]]]"
          `);
});
test('String representation with 1 space indent', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(parse('x=>x;'), 1);
  `, { chapter: 4, native: true }).toMatchInlineSnapshot(`
            "[\\"lambda_expression\\",
            [[[\\"name\\", [\\"x\\", null]], null],
            [[\\"return_statement\\", [[\\"name\\", [\\"x\\", null]], null]], null]]]"
          `);
});
test('String representation with default (2 space) indent', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(parse('x=>x;'));
  `, { chapter: 4, native: true }).toMatchInlineSnapshot(`
            "[ \\"lambda_expression\\",
            [ [[\\"name\\", [\\"x\\", null]], null],
            [[\\"return_statement\\", [[\\"name\\", [\\"x\\", null]], null]], null]]]"
          `);
});
test('String representation with more than 10 space indent should trim to 10 space indent', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
  stringify(parse('x=>x;'), 100);
  `, { chapter: 4, native: true }).toMatchInlineSnapshot(`
            "[         \\"lambda_expression\\",
            [         [[\\"name\\", [\\"x\\", null]], null],
            [[\\"return_statement\\", [[\\"name\\", [\\"x\\", null]], null]], null]]]"
          `);
});
// tslint:enable:max-line-length
test('lineTreeToString', () => {
    return expect((0, stringify_1.lineTreeToString)({
        type: 'block',
        prefixFirst: '[ ',
        prefixRest: '  ',
        block: [
            {
                type: 'block',
                prefixFirst: '[ ',
                prefixRest: '  ',
                block: [
                    { type: 'line', line: { type: 'terminal', str: 'why', length: 3 } },
                    { type: 'line', line: { type: 'terminal', str: 'hello', length: 5 } }
                ],
                suffixRest: ',',
                suffixLast: ' ]'
            },
            { type: 'line', line: { type: 'terminal', str: 'there', length: 5 } },
            { type: 'line', line: { type: 'terminal', str: 'sethbling here', length: 42 } }
        ],
        suffixRest: ',',
        suffixLast: ' ]'
    })).toMatchInlineSnapshot(`
            "[ [ why,
                hello ],
              there,
              sethbling here ]"
          `);
});
test('stringDagToLineTree', () => {
    return expect((0, stringify_1.lineTreeToString)((0, stringify_1.stringDagToLineTree)({
        type: 'multiline',
        lines: ['hello world', 'why hello there', "it's a", '  multiline', 'string!'],
        length: 42
    }, 2, 80))).toMatchInlineSnapshot(`
            "hello world
            why hello there
            it's a
              multiline
            string!"
          `);
});
test('stringDagToLineTree part 2', () => {
    return expect((0, stringify_1.stringDagToLineTree)({
        type: 'pair',
        head: { type: 'terminal', str: '42', length: 2 },
        tail: {
            type: 'pair',
            head: { type: 'terminal', str: '69', length: 2 },
            tail: { type: 'terminal', str: 'null', length: 4 },
            length: 42
        },
        length: 42
    }, 2, 80)).toMatchInlineSnapshot(`
            Object {
              "line": Object {
                "head": Object {
                  "length": 2,
                  "str": "42",
                  "type": "terminal",
                },
                "length": 42,
                "tail": Object {
                  "head": Object {
                    "length": 2,
                    "str": "69",
                    "type": "terminal",
                  },
                  "length": 42,
                  "tail": Object {
                    "length": 4,
                    "str": "null",
                    "type": "terminal",
                  },
                  "type": "pair",
                },
                "type": "pair",
              },
              "type": "line",
            }
          `);
});
test('stringDagToLineTree part 3', () => {
    return expect((0, stringify_1.lineTreeToString)((0, stringify_1.stringDagToLineTree)({
        type: 'pair',
        head: { type: 'terminal', str: '42', length: 2 },
        tail: {
            type: 'pair',
            head: { type: 'terminal', str: '69', length: 2 },
            tail: { type: 'terminal', str: 'null', length: 4 },
            length: 42
        },
        length: 42
    }, 2, 80))).toMatchInlineSnapshot(`"[42, [69, null]]"`);
});
test('stringDagToLineTree part 4', () => {
    return expect((0, stringify_1.lineTreeToString)((0, stringify_1.stringDagToLineTree)({
        type: 'pair',
        head: { type: 'terminal', str: '42', length: 2 },
        tail: {
            type: 'pair',
            head: { type: 'terminal', str: '69', length: 2 },
            tail: { type: 'terminal', str: 'null', length: 4 },
            length: 42
        },
        length: 99
    }, 2, 80))).toMatchInlineSnapshot(`
            "[ 42,
            [69, null]]"
          `);
});
test('value to StringDag', () => {
    return expect((0, stringify_1.lineTreeToString)((0, stringify_1.stringDagToLineTree)((0, stringify_1.valueToStringDag)([
        1,
        [
            2,
            [
                3,
                [
                    4,
                    [
                        5,
                        [
                            6,
                            [
                                7,
                                [
                                    8,
                                    [9, [10, [11, [12, [13, [14, [15, [16, [17, [18, [19, [20, null]]]]]]]]]]]]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]), 2, 80))).toMatchInlineSnapshot(`
            "[ 1,
            [ 2,
            [ 3,
            [ 4,
            [ 5,
            [ 6,
            [ 7,
            [8, [9, [10, [11, [12, [13, [14, [15, [16, [17, [18, [19, [20, null]]]]]]]]]]]]]]]]]]]]"
          `);
});
//# sourceMappingURL=stringify.js.map