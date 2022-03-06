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
const index_1 = require("../../index");
const context_1 = require("../../mocks/context");
const formatters_1 = require("../../utils/formatters");
const testing_1 = require("../../utils/testing");
test('Proper stringify-ing of arguments during potentially infinite iterative function calls', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, formatters_1.stripIndent) `
    function f(x) {
      return f(x);
    }
    const array = [1, 2, 3];
    f(list(1, 2, f, () => 1, array));
  `;
    const error = yield (0, testing_1.expectNativeToTimeoutAndError)(code, 1000);
    expect(error).toMatch((0, formatters_1.stripIndent) `
  Line 2: Potential infinite recursion detected: f([ 1,
  [ 2,
  [ function f(x) {
      return f(x);
    },
  [() => 1, [[1, 2, 3], null]]]]]) ...`);
}));
test('test increasing time limit for functions', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, formatters_1.stripIndent) `
    function f(a, b) {
      return f(a + 1, b + 1);
    }
    f(1, 2);
  `;
    const firstError = yield (0, testing_1.expectNativeToTimeoutAndError)(code, 1000);
    expect(firstError).toMatch('Line 2: Potential infinite recursion detected');
    expect(firstError).toMatch(/f\(\d+, \d+\) \.\.\. f\(\d+, \d+\) \.\.\. f\(\d+, \d+\)/);
    const secondError = yield (0, testing_1.expectNativeToTimeoutAndError)(code, 10000);
    expect(secondError).toMatch('Line 2: Potential infinite recursion detected');
    expect(secondError).toMatch(/f\(\d+, \d+\) \.\.\. f\(\d+, \d+\) \.\.\. f\(\d+, \d+\)/);
}));
test('test increasing time limit for mutual recursion', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, formatters_1.stripIndent) `
    function f(a, b) {
      return g(a + 1, b + 1);
    }
    function g(a, b) {
      return f(a + 1, b + 1);
    }
    f(1, 2);
  `;
    const firstError = yield (0, testing_1.expectNativeToTimeoutAndError)(code, 1000);
    expect(firstError).toMatch(/Line [52]: Potential infinite recursion detected/);
    expect(firstError).toMatch(/f\(\d+, \d+\) \.\.\. g\(\d+, \d+\)/);
    const secondError = yield (0, testing_1.expectNativeToTimeoutAndError)(code, 10000);
    expect(secondError).toMatch(/Line [52]: Potential infinite recursion detected/);
    expect(secondError).toMatch(/f\(\d+, \d+\) \.\.\. g\(\d+, \d+\)/);
}));
test('test increasing time limit for while loops', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, formatters_1.stripIndent) `
    while (true) {
    }
  `;
    const firstError = yield (0, testing_1.expectNativeToTimeoutAndError)(code, 1000);
    expect(firstError).toMatch('Line 1: Potential infinite loop detected');
    const secondError = yield (0, testing_1.expectNativeToTimeoutAndError)(code, 10000);
    expect(secondError).toMatch('Line 1: Potential infinite loop detected');
}));
test('test proper setting of variables in an outer scope', () => __awaiter(void 0, void 0, void 0, function* () {
    const context = (0, context_1.mockContext)(3);
    yield (0, index_1.runInContext)((0, formatters_1.stripIndent) `
    let a = 'old';
    function f() {
      return a;
    }
  `, context);
    const result = yield (0, index_1.runInContext)('a = "new"; f();', context);
    expect(result.status).toBe('finished');
    expect(result.value).toBe('new');
}));
test('using internal names still work', () => __awaiter(void 0, void 0, void 0, function* () {
    const context = (0, context_1.mockContext)(3);
    let result = yield (0, index_1.runInContext)((0, formatters_1.stripIndent) `
    const boolOrErr = 1;
    const program = 2;
    function wrap() {
      return boolOrErr;
    }
    wrap();
  `, context);
    expect(result.status).toBe('finished');
    expect(result.value).toBe(1);
    result = yield (0, index_1.runInContext)('program;', context);
    expect(result.status).toBe('finished');
    expect(result.value).toBe(2);
}));
test('assigning a = b where b was from a previous program call works', () => __awaiter(void 0, void 0, void 0, function* () {
    const context = (0, context_1.mockContext)(3);
    const result = yield (0, index_1.runInContext)((0, formatters_1.stripIndent) `
    let b = null;
    b = pair;
    b = 1;
  `, context);
    expect(result.status).toBe('finished');
    expect(result.value).toBe(1);
}));
//# sourceMappingURL=native.js.map