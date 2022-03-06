"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../mocks/context");
const parser_1 = require("../../parser/parser");
const operators_1 = require("../../utils/operators");
const instrument_1 = require("../instrument");
function mockFunctionsAndState() {
    const theState = undefined;
    const functions = {};
    const returnFirst = (...args) => args[0];
    const nothing = (...args) => { };
    functions[instrument_1.InfiniteLoopRuntimeFunctions.nothingFunction] = nothing;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.concretize] = returnFirst;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.hybridize] = returnFirst;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.wrapArg] = returnFirst;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.dummify] = returnFirst;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.saveBool] = returnFirst;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.saveVar] = returnFirst;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.preFunction] = nothing;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.returnFunction] = returnFirst;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.postLoop] = (_, res) => res;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.enterLoop] = nothing;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.exitLoop] = nothing;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.trackLoc] = (_1, _2, fn) => (fn ? fn() : undefined);
    functions[instrument_1.InfiniteLoopRuntimeFunctions.evalB] = operators_1.evaluateBinaryExpression;
    functions[instrument_1.InfiniteLoopRuntimeFunctions.evalU] = operators_1.evaluateUnaryExpression;
    return [functions, theState];
}
/**
 * Returns the value saved in the code using the builtin 'output'.
 * e.g. runWithMock('output(2)') --> 2
 */
function runWithMock(main, codeHistory, builtins = new Map()) {
    let output = undefined;
    builtins.set('output', (x) => (output = x));
    builtins.set('undefined', undefined);
    const context = (0, context_1.mockContext)(4);
    const program = (0, parser_1.parse)(main, context);
    expect(program).not.toBeUndefined();
    let previous = [];
    if (codeHistory !== undefined) {
        const restOfCode = codeHistory.map(x => (0, parser_1.parse)(x, context));
        for (const code of restOfCode) {
            expect(code).not.toBeUndefined();
        }
        previous = restOfCode;
    }
    const [mockFunctions, mockState] = mockFunctionsAndState();
    const instrumentedCode = (0, instrument_1.instrument)(previous, program, builtins.keys());
    const { builtinsId, functionsId, stateId } = instrument_1.InfiniteLoopRuntimeObjectNames;
    const sandboxedRun = new Function('code', functionsId, stateId, builtinsId, `return eval(code)`);
    sandboxedRun(instrumentedCode, mockFunctions, mockState, builtins);
    return output;
}
test('builtins work', () => {
    const main = 'output(2);';
    expect(runWithMock(main, [])).toBe(2);
});
test('binary and unary expressions work', () => {
    expect(runWithMock('output(1+1);', [])).toBe(2);
    expect(runWithMock('output(!true);', [])).toBe(false);
});
test('assignment works as expected', () => {
    const main = `let x = 2;
  let a = [];
  a[0] = 3;
  output(x+a[0]);`;
    expect(runWithMock(main)).toBe(5);
});
test('globals from old code accessible', () => {
    const main = 'output(z+1);';
    const prev = ['const z = w+1;', 'let w = 10;'];
    expect(runWithMock(main, prev)).toBe(12);
});
test('functions run as expected', () => {
    const main = `function f(x,y) {
    return x===0?x:f(x-1,y)+y;
  }
  output(f(5,2));`;
    expect(runWithMock(main)).toBe(10);
});
test('nested functions run as expected', () => {
    const main = `function f(x,y) {
    function f(x,y) {
      return 0;
    }
    return x===0?x:f(x-1,y)+y;
  }
  output(f(5,2));`;
    expect(runWithMock(main)).toBe(2);
});
test('higher order functions run as expected', () => {
    const main = `function run(f, x) {
    return f(x+1);
  }
  output(run(x=>x+1, 1));`;
    expect(runWithMock(main)).toBe(3);
});
test('loops run as expected', () => {
    const main = `let w = 0;
  for (let i = w; i < 10; i=i+1) {w = i;}
  output(w);`;
    expect(runWithMock(main)).toBe(9);
});
test('nested loops run as expected', () => {
    const main = `let w = 0;
  for (let i = w; i < 10; i=i+1) {
    for (let j = 0; j < 10; j=j+1) {
      w = w + 1;
    }
  }
  output(w);`;
    expect(runWithMock(main)).toBe(100);
});
test('multidimentional arrays work', () => {
    const main = `const x = [[1],[2]];
  output(x[1] === undefined? undefined: x[1][0]);`;
    expect(runWithMock(main)).toBe(2);
});
test('if statements work as expected', () => {
    const main = `let x = 1;
  if (x===1) {
    x = x + 1;
  } else {}
  output(x);`;
    expect(runWithMock(main)).toBe(2);
});
test('combination of loops and functions run as expected', () => {
    const main = `function test(x) {
    return x===0;
  }
  const minus = (a,b) => a-b;
  let w = 10;
  let z = 0;
  while(!test(w)) {
    for (let j = 0; j < 10; j=j+1) {
      z = z + 1;
    }
    w = minus(w,1);
  }
  output(z);`;
    expect(runWithMock(main)).toBe(100);
});
//# sourceMappingURL=instrument.js.map