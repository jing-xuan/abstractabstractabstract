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
const __1 = require("../..");
const context_1 = require("../../mocks/context");
const errors_1 = require("../errors");
const runtime_1 = require("../runtime");
test('works in runInContext when throwInfiniteLoops is true', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = `function fib(x) {
    return fib(x-1) + fib(x-2);
  }
  fib(100000);`;
    const context = (0, context_1.mockContext)(4);
    yield (0, __1.runInContext)(code, context, { throwInfiniteLoops: true });
    const lastError = context.errors[context.errors.length - 1];
    expect(lastError instanceof errors_1.InfiniteLoopError).toBe(true);
    const result = lastError;
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
}));
test('works in runInContext when throwInfiniteLoops is false', () => __awaiter(void 0, void 0, void 0, function* () {
    const code = `function fib(x) {
    return fib(x-1) + fib(x-2);
  }
  fib(100000);`;
    const context = (0, context_1.mockContext)(4);
    yield (0, __1.runInContext)(code, context, { throwInfiniteLoops: false });
    const lastError = context.errors[context.errors.length - 1];
    expect(lastError instanceof errors_1.InfiniteLoopError).toBe(false);
    const result = (0, errors_1.getInfiniteLoopData)(context);
    expect(result).toBeDefined();
    expect(result === null || result === void 0 ? void 0 : result[0]).toBe(errors_1.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result[1]).toBe(false);
}));
test('non-infinite recursion not detected', () => {
    const code = `function fib(x) {
        return x<=1?x:fib(x-1) + fib(x-2);
    }
    fib(100000);
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result).toBeUndefined();
});
test('non-infinite loop not detected', () => {
    const code = `for(let i = 0;i<2000;i=i+1){i+1;}
    let j = 0;
    while(j<2000) {j=j+1;}
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result).toBeUndefined();
});
test('no base case function detected', () => {
    const code = `function fib(x) {
        return fib(x-1) + fib(x-2);
    }
    fib(100000);
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
});
test('no base case loop detected', () => {
    const code = `for(let i = 0;true;i=i+1){i+1;}
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
});
test('no variables changing function detected', () => {
    const code = `let x = 1;
    function f() {
        return x===0?x:f();
    }
    f();
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.Cycle);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
    expect(result === null || result === void 0 ? void 0 : result.explain()).toContain('None of the variables are being updated.');
});
test('no state change function detected', () => {
    const code = `let x = 1;
    function f() {
        return x===0?x:f();
    }
    f();
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.Cycle);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
    expect(result === null || result === void 0 ? void 0 : result.explain()).toContain('None of the variables are being updated.');
});
test('infinite cycle detected', () => {
    const code = `function f(x) {
        return x[0] === 1? x : f(x);
    }
    f([2,3,4]);
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.Cycle);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
    expect(result === null || result === void 0 ? void 0 : result.explain()).toContain('cycle');
    expect(result === null || result === void 0 ? void 0 : result.explain()).toContain('[2,3,4]');
});
test('infinite data structures detected', () => {
    const code = `function f(x) {
        return is_null(x)? x : f(tail(x));
    }
    let circ = list(1,2,3);
    set_tail(tail(tail(circ)), circ);
    f(circ);
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.Cycle);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
    expect(result === null || result === void 0 ? void 0 : result.explain()).toContain('cycle');
    expect(result === null || result === void 0 ? void 0 : result.explain()).toContain('(CIRCULAR)');
});
test('functions using SMT work', () => {
    const code = `function f(x) {
        return x===0? x: f(x+1);
    }
    f(1);
    `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.FromSmt);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
});
test('detect forcing infinite streams', () => {
    const code = `stream_to_list(integers_from(0));`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.NoBaseCase);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(true);
});
test('detect mutual recursion', () => {
    const code = `function e(x){
    return x===0?1:1-o(x-1);
    }
    function o(x){
        return x===1?0:1-e(x-1);
    }
    e(9);`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.FromSmt);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
});
test('functions passed as arguments not checked', () => {
    // if they are checked -> this will throw no base case
    const code = `const twice = f => x => f(f(x));
  const thrice = f => x => f(f(f(x)));
  const add = x => x + 1;
  
  (thrice)(twice(twice))(twice(add))(0);`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result).toBeUndefined();
});
test('detect complicated cycle example', () => {
    const code = `function permutations(s) {
    return is_null(s)
    ? list(null)
    : accumulate(append, null,
    map(x => map(p => pair(x, p),
    permutations(remove(x, s))),
    s));
   }
   
   function remove_duplicate(xs) {
     return is_null(xs)
       ? xs
       : pair(head(xs),
         remove_duplicate(filter(x => x !== equal(head(xs),x), xs)));
   }
   
   remove_duplicate(list(list(1,2,3), list(1,2,3)));
   `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.Cycle);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
});
test('detect complicated cycle example 2', () => {
    const code = `function make_big_int_from_number(num){
    let output = num;
    while(output !== 0){
        const digits = num % 10;
        output = math_floor(num / 10);
        
    }
}
make_big_int_from_number(1234);
   `;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.Cycle);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
});
test('detect complicated fromSMT example 2', () => {
    const code = `function fast_power(b,n){
    if (n % 2 === 0){
        return b* fast_power(b, n-2);
    } else { 
        return b * fast_power(b, n-2);
    }

  }
  fast_power(2,3);`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.FromSmt);
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(false);
});
test('detect complicated stream example', () => {
    const code = `function up(a, b) {
    return (a > b)
            ? up(1, 1 + b)
            : pair(a, () => stream_reverse(up(a + 1, b)));
  }
  eval_stream(up(1,1), 22);`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result).toBeDefined();
    expect(result === null || result === void 0 ? void 0 : result.streamMode).toBe(true);
});
test('math functions are disabled in smt solver', () => {
    const code = `
  function f(x) {
    return x===0? x: f(math_floor(x+1));
  }
  f(1);`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result).toBeUndefined();
});
test('cycle detection ignores non deterministic functions', () => {
    const code = `
  function f(x) {
    return x===0?0:f(math_floor(math_random()/2) + 1);
  }
  f(1);`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result).toBeUndefined();
});
test('handle imports properly', () => {
    const code = `import {thrice} from "repeat";
  function f(x) { return is_number(x) ? f(x) : 42; }
  display(f(thrice(x=>x+1)(0)));`;
    const result = (0, runtime_1.testForInfiniteLoop)(code, []);
    expect(result === null || result === void 0 ? void 0 : result.infiniteLoopType).toBe(errors_1.InfiniteLoopErrorType.Cycle);
});
//# sourceMappingURL=runtime.js.map