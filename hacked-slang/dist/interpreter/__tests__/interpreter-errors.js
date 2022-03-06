"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
const formatters_1 = require("../../utils/formatters");
const testing_1 = require("../../utils/testing");
const undefinedVariable = (0, formatters_1.stripIndent) `
im_undefined;
`;
const undefinedVariableVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
im_undefined;
`;
test('Undefined variable error is thrown', () => {
    return (0, testing_1.expectParsedError)(undefinedVariable).toMatchInlineSnapshot(`"Line 1: Name im_undefined not declared."`);
});
test('Undefined variable error is thrown - verbose', () => {
    return (0, testing_1.expectParsedError)(undefinedVariableVerbose).toMatchInlineSnapshot(`
            "Line 2, Column 0: Name im_undefined not declared.
            Before you can read the value of im_undefined, you need to declare it as a variable or a constant. You can do this using the let or const keywords.
            "
          `);
});
test('Undefined variable error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(undefinedVariable, undefinedVariableVerbose).toBe(undefined);
});
const assignToBuiltin = (0, formatters_1.stripIndent) `
map = 5;
`;
const assignToBuiltinVerbose = (0, formatters_1.stripIndent) `
  "enable verbose";
  map = 5;
`;
test('Error when assigning to builtin', () => {
    return (0, testing_1.expectParsedError)(assignToBuiltin, { chapter: 3 }).toMatchInlineSnapshot(`"Line 1: Cannot assign new value to constant map."`);
});
test('Error when assigning to builtin - verbose', () => {
    return (0, testing_1.expectParsedError)(assignToBuiltinVerbose, { chapter: 3 }).toMatchInlineSnapshot(`
            "Line 2, Column 0: Cannot assign new value to constant map.
            As map was declared as a constant, its value cannot be changed. You will have to declare a new variable.
            "
          `);
});
test('Assigning to builtin error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(assignToBuiltin, assignToBuiltinVerbose).toBe(undefined);
});
const assignToBuiltin1 = (0, formatters_1.stripIndent) `
undefined = 5;
`;
const assignToBuiltinVerbose1 = (0, formatters_1.stripIndent) `
  "enable verbose";
  undefined = 5;
`;
test('Error when assigning to builtin', () => {
    return (0, testing_1.expectParsedError)(assignToBuiltin1, { chapter: 3 }).toMatchInlineSnapshot(`"Line 1: Cannot assign new value to constant undefined."`);
});
test('Error when assigning to builtin - verbose', () => {
    return (0, testing_1.expectParsedError)(assignToBuiltinVerbose1, { chapter: 3 }).toMatchInlineSnapshot(`
            "Line 2, Column 0: Cannot assign new value to constant undefined.
            As undefined was declared as a constant, its value cannot be changed. You will have to declare a new variable.
            "
          `);
});
test('Assigning to builtin error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(assignToBuiltin1, assignToBuiltinVerbose1).toBe(undefined);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when assigning to property on undefined', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    undefined.prop = 123;
  `, { chapter: 100 }).toMatchInlineSnapshot(`"Line 1: Cannot assign property prop of undefined"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when assigning to property on variable with value undefined', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const u = undefined;
    u.prop = 123;
  `, { chapter: 100 }).toMatchInlineSnapshot(`"Line 2: Cannot assign property prop of undefined"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when deeply assigning to property on variable with value undefined', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const u = undefined;
    u.prop.prop = 123;
  `, { chapter: 100 }).toMatchInlineSnapshot(`"Line 2: Cannot read property prop of undefined"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing property on undefined', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    undefined.prop;
  `, { chapter: 100 }).toMatchInlineSnapshot(`"Line 1: Cannot read property prop of undefined"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when deeply accessing property on undefined', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    undefined.prop.prop;
  `, { chapter: 100 }).toMatchInlineSnapshot(`"Line 1: Cannot read property prop of undefined"`);
});
test('Nice errors when errors occur inside builtins', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    parse_int("10");
  `, { chapter: 4 }).toMatchInlineSnapshot(`"Line 1: Expected 2 arguments, but got 1."`);
});
test('Nice errors when errors occur inside builtins', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    parse("'");
  `, { chapter: 4 }).toMatchInlineSnapshot(`"Line 1: ParseError: SyntaxError: Unterminated string constant (1:0)"`);
});
test("Builtins don't create additional errors when it's not their fault", () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f(x) {
      return a;
    }
    map(f, list(1, 2));
  `, { chapter: 4 }).toMatchInlineSnapshot(`"Line 2: Name a not declared."`);
});
test('Infinite recursion with a block bodied function', () => {
    return (0, testing_1.expectParsedErrorNoSnapshot)((0, formatters_1.stripIndent) `
    function i(n) {
      return n === 0 ? 0 : 1 + i(n-1);
    }
    i(1000);
  `, { chapter: 4 }).toEqual(expect.stringMatching(/Maximum call stack size exceeded\n *(i\(\d*\)[^i]{2,4}){3}/));
}, 15000);
test('Infinite recursion with function calls in argument', () => {
    return (0, testing_1.expectParsedErrorNoSnapshot)((0, formatters_1.stripIndent) `
    function i(n, redundant) {
      return n === 0 ? 0 : 1 + i(n-1, r());
    }
    function r() {
      return 1;
    }
    i(1000, 1);
  `, { chapter: 4 }).toEqual(expect.stringMatching(/Maximum call stack size exceeded\n *(i\(\d*, 1\)[^i]{2,4}){2}[ir]/));
}, 10000);
test('Infinite recursion of mutually recursive functions', () => {
    return (0, testing_1.expectParsedErrorNoSnapshot)((0, formatters_1.stripIndent) `
    function f(n) {
      return n === 0 ? 0 : 1 + g(n - 1);
    }
    function g(n) {
      return 1 + f(n);
    }
    f(1000);
  `, { chapter: 4 }).toEqual(expect.stringMatching(/Maximum call stack size exceeded\n([^f]*f[^g]*g[^f]*f|[^g]*g[^f]*f[^g]*g)/));
});
const callingNonFunctionValueUndefined = (0, formatters_1.stripIndent) `
undefined();
`;
const callingNonFunctionValueUndefinedVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
  undefined();
`;
// should not be different when error passing is fixed
test('Error when calling non function value undefined', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueUndefined, {
        native: true
    }).toMatchInlineSnapshot(`"Line 1: Calling non-function value undefined."`);
});
test('Error when calling non function value undefined - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueUndefinedVerbose).toMatchInlineSnapshot(`
            "Line 2, Column 2: Calling non-function value undefined.
            Because undefined is not a function, you cannot run undefined().
            "
          `);
});
test('Calling non function value undefined error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValueUndefined, callingNonFunctionValueUndefinedVerbose).toBe(undefined);
});
const callingNonFunctionValueUndefinedArgs = (0, formatters_1.stripIndent) `
undefined(1, true);
`;
const callingNonFunctionValueUndefinedArgsVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
  undefined(1, true);
`;
// should not be different when error passing is fixed
test('Error when calling non function value undefined with arguments', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueUndefinedArgs, {
        native: false
    }).toMatchInlineSnapshot(`"Line 1: Calling non-function value undefined."`);
});
test('Error when calling non function value undefined with arguments - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueUndefinedArgsVerbose).toMatchInlineSnapshot(`
            "Line 2, Column 2: Calling non-function value undefined.
            Because undefined is not a function, you cannot run undefined(1, true).
            "
          `);
});
test('Calling non function value undefined with arguments error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValueUndefinedArgs, callingNonFunctionValueUndefinedArgsVerbose).toBe(undefined);
});
const callingNonFunctionValueNull = (0, formatters_1.stripIndent) `
null();
`;
const callingNonFunctionValueNullVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
  null();
`;
test('Error when calling non function value null', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueNull).toMatchInlineSnapshot(`"Line 1: null literals are not allowed."`);
});
test('Error when calling non function value null - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueNullVerbose).toMatchInlineSnapshot(`
            "Line 2, Column 2: null literals are not allowed.
            They're not part of the Source §1 specs.
            "
          `);
});
test('Calling non function value null error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValueNull, callingNonFunctionValueNullVerbose).toBe(undefined);
});
const callingNonFunctionValueTrue = (0, formatters_1.stripIndent) `
true();
`;
const callingNonFunctionValueTrueVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
  true();
`;
test('Error when calling non function value true', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueTrue, { native: true }).toMatchInlineSnapshot(`"Line 1: Calling non-function value true."`);
});
test('Error when calling non function value true - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueTrueVerbose).toMatchInlineSnapshot(`
            "Line 2, Column 2: Calling non-function value true.
            Because true is not a function, you cannot run true().
            "
          `);
});
test('Calling non function value true error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValueTrue, callingNonFunctionValueTrueVerbose).toBe(undefined);
});
const callingNonFunctionValue0 = (0, formatters_1.stripIndent) `
0();
`;
const callingNonFunctionValue0Verbose = (0, formatters_1.stripIndent) `
"enable verbose";
  0();
`;
test('Error when calling non function value 0', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValue0, { native: true }).toMatchInlineSnapshot(`"Line 1: Calling non-function value 0."`);
});
test('Error when calling non function value 0 - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValue0Verbose).toMatchInlineSnapshot(`
            "Line 2, Column 2: Calling non-function value 0.
            Because 0 is not a function, you cannot run 0(). If you were planning to perform multiplication by 0, you need to use the * operator.
            "
          `);
});
test('Calling non function value 0 error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValue0, callingNonFunctionValue0Verbose).toBe(undefined);
});
const callingNonFunctionValueString = (0, formatters_1.stripIndent) `
'string'();
`;
const callingNonFunctionValueStringVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
  'string'();
`;
test('Error when calling non function value "string"', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueString, { native: true }).toMatchInlineSnapshot(`"Line 1: Calling non-function value \\"string\\"."`);
});
test('Error when calling non function value "string" - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueStringVerbose).toMatchInlineSnapshot(`
            "Line 2, Column 2: Calling non-function value \\"string\\".
            Because \\"string\\" is not a function, you cannot run \\"string\\"().
            "
          `);
});
test('Calling non function value string error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValueString, callingNonFunctionValueStringVerbose).toBe(undefined);
});
const callingNonFunctionValueArray = (0, formatters_1.stripIndent) `
[1]();
`;
const callingNonFunctionValueArrayVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
[1]();
`;
test('Error when calling non function value array', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueArray, {
        chapter: 3,
        native: true
    }).toMatchInlineSnapshot(`"Line 1: Calling non-function value [1]."`);
});
test('Error when calling non function value array - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueArrayVerbose, { chapter: 3 })
        .toMatchInlineSnapshot(`
            "Line 2, Column 0: Calling non-function value [1].
            Because [1] is not a function, you cannot run [1]().
            "
          `);
});
test('Calling non function value array error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValueArray, callingNonFunctionValueArrayVerbose).toBe(undefined);
});
const callingNonFunctionValueObject = (0, formatters_1.stripIndent) `
({a: 1})();
`;
const callingNonFunctionValueObjectVerbose = (0, formatters_1.stripIndent) `
"enable verbose";
({a: 1})();
`;
test('Error when calling non function value object', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueObject, { chapter: 100 }).toMatchInlineSnapshot(`"Line 1: Calling non-function value {\\"a\\": 1}."`);
});
test('Error when calling non function value object - verbose', () => {
    return (0, testing_1.expectParsedError)(callingNonFunctionValueObjectVerbose, { chapter: 100 })
        .toMatchInlineSnapshot(`
            "Line 2, Column 0: Calling non-function value {\\"a\\": 1}.
            Because {\\"a\\": 1} is not a function, you cannot run {\\"a\\": 1}().
            "
          `);
});
test('Calling non function value object error message differs from verbose version', () => {
    return (0, testing_1.expectDifferentParsedErrors)(callingNonFunctionValueObject, callingNonFunctionValueObjectVerbose).toBe(undefined);
});
test('Error when calling non function value object - verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
      "enable verbose";
      ({a: 1})();
    `, { chapter: 100 }).toMatchInlineSnapshot(`
            "Line 2, Column 0: Calling non-function value {\\"a\\": 1}.
            Because {\\"a\\": 1} is not a function, you cannot run {\\"a\\": 1}().
            "
          `);
});
test('Error when calling function with too few arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f(x) {
      return x;
    }
    f();
  `, { native: true }).toMatchInlineSnapshot(`"Line 4: Expected 1 arguments, but got 0."`);
});
test('Error when calling function with too few arguments - verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
      function f(x) {
        return x;
      }
      f();
    `).toMatchInlineSnapshot(`
            "Line 5, Column 2: Expected 1 arguments, but got 0.
            Try calling function f again, but with 1 argument instead. Remember that arguments are separated by a ',' (comma).
            "
          `);
});
test('Error when calling function with too many arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f(x) {
      return x;
    }
    f(1, 2);
  `, { native: true }).toMatchInlineSnapshot(`"Line 4: Expected 1 arguments, but got 2."`);
});
test('Error when calling function with too many arguments - verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
      function f(x) {
        return x;
      }
      f(1, 2);
    `).toMatchInlineSnapshot(`
            "Line 5, Column 2: Expected 1 arguments, but got 2.
            Try calling function f again, but with 1 argument instead. Remember that arguments are separated by a ',' (comma).
            "
          `);
});
test('Error when calling arrow function with too few arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const f = x => x;
    f();
  `, { native: true }).toMatchInlineSnapshot(`"Line 2: Expected 1 arguments, but got 0."`);
});
test('Error when calling arrow function with too few arguments - verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
  "enable verbose";
    const f = x => x;
    f();
  `).toMatchInlineSnapshot(`
            "Line 3, Column 2: Expected 1 arguments, but got 0.
            Try calling function f again, but with 1 argument instead. Remember that arguments are separated by a ',' (comma).
            "
          `);
});
test('Error when calling arrow function with too many arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const f = x => x;
    f(1, 2);
  `, { native: true }).toMatchInlineSnapshot(`"Line 2: Expected 1 arguments, but got 2."`);
});
test('Error when calling arrow function with too many arguments - verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
      const f = x => x;
      f(1, 2);
    `).toMatchInlineSnapshot(`
            "Line 3, Column 2: Expected 1 arguments, but got 2.
            Try calling function f again, but with 1 argument instead. Remember that arguments are separated by a ',' (comma).
            "
          `);
});
test('Error when calling function from member expression with too many arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const f = [x => x];
    f[0](1, 2);
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: Expected 1 arguments, but got 2."`);
});
test('Error when calling function from member expression with too many arguments - verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
      const f = [x => x];
      f[0](1, 2);
    `, { chapter: 3 }).toMatchInlineSnapshot(`
            "Line 3, Column 2: Expected 1 arguments, but got 2.
            Try calling function f[0] again, but with 1 argument instead. Remember that arguments are separated by a ',' (comma).
            "
          `);
});
test('Error when calling arrow function in tail call with too many arguments - verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
    const g = () => 1;
    const f = x => g(x);
    f(1);
  `).toMatchInlineSnapshot(`
            "Line 3, Column 15: Expected 0 arguments, but got 1.
            Try calling function g again, but with 0 arguments instead. Remember that arguments are separated by a ',' (comma).
            "
          `);
});
test('Error when calling arrow function in tail call with too many arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const g = () => 1;
    const f = x => g(x);
    f(1);
  `, { native: true }).toMatchInlineSnapshot(`"Line 2: Expected 0 arguments, but got 1."`);
});
test('Error when calling builtin function in with too many arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    is_number(1, 2, 3);
  `, { native: true }).toMatchInlineSnapshot(`"Line 1: Expected 1 arguments, but got 3."`);
});
test('Error when calling builtin function in with too few arguments', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    parse_int("");
  `, { native: true }).toMatchInlineSnapshot(`"Line 1: Expected 2 arguments, but got 1."`);
});
test('No error when calling list function in with variable arguments', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    list();
    list(1);
    list(1, 2, 3);
    list(1, 2, 3, 4, 5, 6, 6);
  `, { native: true, chapter: 2 }).toMatchInlineSnapshot(`
            Array [
              1,
              Array [
                2,
                Array [
                  3,
                  Array [
                    4,
                    Array [
                      5,
                      Array [
                        6,
                        Array [
                          6,
                          null,
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ]
          `);
});
test('No error when calling display function in with variable arguments', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    display(1);
    display(1, "test");
  `, { native: true, chapter: 2 }).toMatchInlineSnapshot(`1`);
});
test('No error when calling stringify function in with variable arguments', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    stringify(1, 2);
    stringify(1, 2, 3);
  `, { native: true, chapter: 2 }).toMatchInlineSnapshot(`"1"`);
});
test('No error when calling math_max function in with variable arguments', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    math_max();
    math_max(1, 2);
    math_max(1, 2, 3);
  `, { native: true, chapter: 2 }).toMatchInlineSnapshot(`3`);
});
test('No error when calling math_min function in with variable arguments', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    math_min();
    math_min(1, 2);
    math_min(1, 2, 3);
  `, { native: true, chapter: 2 }).toMatchInlineSnapshot(`1`);
});
test('Error with too many arguments passed to math_sin', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    math_sin(7,8);
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 1: Expected 1 arguments, but got 2."`);
});
test('Error with too few arguments passed to rest parameters', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function rest(a, b, ...c) {}
    rest(1);
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: Expected 2 or more arguments, but got 1."`);
});
test('Error when redeclaring constant', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const f = x => x;
    const f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:6)"`);
});
test('Error when redeclaring constant as variable', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const f = x => x;
    let f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:4)"`);
});
test('Error when redeclaring variable as constant', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    let f = x => x;
    const f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:6)"`);
});
test('Error when redeclaring variable', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    let f = x => x;
    let f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:4)"`);
});
test('Error when redeclaring function after let', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    let f = x => x;
    function f() {}
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:9)"`);
});
test('Error when redeclaring function after let --verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
    let f = x => x;
    function f() {}
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`
            "Line 3, Column 9: SyntaxError: Identifier 'f' has already been declared (3:9)
            There is a syntax error in your program
            "
          `);
});
test('Error when redeclaring function after function', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f() {}
    function f() {}
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:9)"`);
});
test('Error when redeclaring function after function --verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
    function f() {}
    function f() {}
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`
            "Line 3, Column 9: SyntaxError: Identifier 'f' has already been declared (3:9)
            There is a syntax error in your program
            "
          `);
});
test('Error when redeclaring function after const', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    const f = x => x;
    function f() {}
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:9)"`);
});
test('Error when redeclaring function after const --verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
    const f = x => x;
    function f() {}
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`
            "Line 3, Column 9: SyntaxError: Identifier 'f' has already been declared (3:9)
            There is a syntax error in your program
            "
          `);
});
test('Error when redeclaring const after function', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f() {}
    const f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:6)"`);
});
test('Error when redeclaring const after function --verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
    function f() {}
    const f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`
            "Line 3, Column 6: SyntaxError: Identifier 'f' has already been declared (3:6)
            There is a syntax error in your program
            "
          `);
});
test('Error when redeclaring let after function', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f() {}
    let f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 2: SyntaxError: Identifier 'f' has already been declared (2:4)"`);
});
test('Error when redeclaring let after function --verbose', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    "enable verbose";
    function f() {}
    let f = x => x;
  `, { chapter: 3, native: true }).toMatchInlineSnapshot(`
            "Line 3, Column 4: SyntaxError: Identifier 'f' has already been declared (3:4)
            There is a syntax error in your program
            "
          `);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing property of null', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    null["prop"];
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Cannot read property prop of null"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing property of undefined', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    undefined["prop"];
  `, { chapter: 10, native: true }).toMatchInlineSnapshot(`"Line 1: Cannot read property prop of undefined"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing inherited property of builtin', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    pair["constructor"];
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`
            "Line 1: Cannot read inherited property constructor of function pair(left, right) {
            	[implementation hidden]
            }"
          `);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing inherited property of function', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f() {}
    f["constructor"];
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 2: Cannot read inherited property constructor of function f() {}"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing inherited property of arrow function', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    (() => 1)["constructor"];
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Cannot read inherited property constructor of () => 1"`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing inherited property of array', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    [].push;
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Cannot read inherited property push of []"`);
});
test('Error when accessing inherited property of object', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    ({}).valueOf;
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Cannot read inherited property valueOf of {}."`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing inherited property of string', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    'hi'.includes;
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Cannot read inherited property includes of \\"hi\\""`);
});
// NOTE: Obsoleted due to strict types on member access
test.skip('Error when accessing inherited property of number', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    (1).toPrecision;
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Cannot read inherited property toPrecision of 1"`);
});
test('Access local property', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    ({a: 0})["a"];
  `, { chapter: 100, native: true }).toMatchInlineSnapshot(`0`);
});
test('Type error when accessing property of null', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    null.prop;
    `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Expected object or array, got null."`);
});
test('Type error when accessing property of string', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    'hi'.length;
    `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Expected object or array, got string."`);
});
test('Type error when accessing property of function', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f() {
      return 1;
    }
    f.prototype;
    `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 4: Expected object or array, got function."`);
});
test('Type error when assigning property of string', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    'hi'.prop = 5;
    `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 1: Expected object or array, got string."`);
});
test('Type error when assigning property of function', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function f() {
      return 1;
    }
    f.prop = 5;
    `, { chapter: 100, native: true }).toMatchInlineSnapshot(`"Line 4: Expected object or array, got function."`);
});
test('Type error with non boolean in if statement, error line at if statement, not at 1', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    if (
    1
    ) {
      2;
    } else {}
    `, { chapter: 1, native: true }).toMatchInlineSnapshot(`"Line 1: Expected boolean as condition, got number."`);
});
test('Type error with <number> * <nonnumber>, error line at <number>, not <nonnumber>', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    12
    *
    'string';
    `, { chapter: 1, native: true }).toMatchInlineSnapshot(`"Line 1: Expected number on right hand side of operation, got string."`);
});
test('Cascading js errors work properly 1', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function make_alternating_stream(stream) {
      return pair(head(stream), () => make_alternating_stream(
                                        negate_whole_stream(
                                            stream_tail(stream))));
    }

    function negate_whole_stream(stream) {
        return pair(-head(stream), () => negate_whole_stream(stream_tail(stream)));
    }

    const ones = pair(1, () => ones);
    eval_stream(make_alternating_stream(enum_stream(1, 9)), 10);
    `, { chapter: 3, native: true }).toMatchInlineSnapshot(`"Line 8: Error: head(xs) expects a pair as argument xs, but encountered null"`);
});
test('Cascading js errors work properly', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    function h(p) {
      return head(p);
    }

    h(null);
    `, { chapter: 2, native: true }).toMatchInlineSnapshot(`"Line 2: Error: head(xs) expects a pair as argument xs, but encountered null"`);
});
//# sourceMappingURL=interpreter-errors.js.map