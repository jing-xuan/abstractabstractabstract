"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors/errors");
const runtimeSourceError_1 = require("../../errors/runtimeSourceError");
const timeoutErrors_1 = require("../../errors/timeoutErrors");
const context_1 = require("../../mocks/context");
const errors_2 = require("../errors");
const noBaseCaseError = new errors_2.InfiniteLoopError('f', false, 'test', errors_2.InfiniteLoopErrorType.NoBaseCase);
const fakePos = { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } };
test('timeout errors are potential infinite loops', () => {
    const error = new timeoutErrors_1.TimeoutError();
    expect((0, errors_2.isPotentialInfiniteLoop)(error)).toBe(true);
});
test('stack overflows are potential infinite loops', () => {
    const fakePos = { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } };
    const makeErrorWithString = (str) => new errors_1.ExceptionError(new Error(str), fakePos);
    for (const message of Object.values(errors_2.StackOverflowMessages)) {
        const error = makeErrorWithString(message);
        expect((0, errors_2.isPotentialInfiniteLoop)(error)).toBe(true);
    }
});
test('other errors are not potential infinite loops', () => {
    const runtimeError = new runtimeSourceError_1.RuntimeSourceError();
    const exceptionError = new errors_1.ExceptionError(new Error('Unexpected'), fakePos);
    expect((0, errors_2.isPotentialInfiniteLoop)(runtimeError)).toBe(false);
    expect((0, errors_2.isPotentialInfiniteLoop)(exceptionError)).toBe(false);
});
test('getInfiniteLoopData works when error is directly reported', () => {
    const context = (0, context_1.mockContext)(4);
    context.errors.push(noBaseCaseError);
    context.previousCode.push('test');
    const result = (0, errors_2.getInfiniteLoopData)(context);
    expect(result).toBeDefined();
    expect(result === null || result === void 0 ? void 0 : result[0]).toBe(errors_2.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result[3].length).toBe(1);
    expect(result === null || result === void 0 ? void 0 : result[3]).toContain('test');
});
test('getInfiniteLoopData works when error hidden in timeout', () => {
    const error = new timeoutErrors_1.TimeoutError();
    error.infiniteLoopError = noBaseCaseError;
    const context = (0, context_1.mockContext)(4);
    context.errors.push(error);
    context.previousCode.push('test');
    const result = (0, errors_2.getInfiniteLoopData)(context);
    expect(result).toBeDefined();
    expect(result === null || result === void 0 ? void 0 : result[0]).toBe(errors_2.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result[3].length).toBe(1);
    expect(result === null || result === void 0 ? void 0 : result[3]).toContain('test');
});
test('getInfiniteLoopData works when error hidden in exceptionError', () => {
    const innerError = new Error();
    innerError.infiniteLoopError = noBaseCaseError;
    const context = (0, context_1.mockContext)(4);
    context.errors.push(new errors_1.ExceptionError(innerError, fakePos));
    context.previousCode.push('test');
    const result = (0, errors_2.getInfiniteLoopData)(context);
    expect(result).toBeDefined();
    expect(result === null || result === void 0 ? void 0 : result[0]).toBe(errors_2.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result[3].length).toBe(1);
    expect(result === null || result === void 0 ? void 0 : result[3]).toContain('test');
});
//# sourceMappingURL=errors.js.map