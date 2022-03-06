"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../mocks/context");
const rttc = require("../rttc");
const num = 0;
const bool = true;
const str = ' ';
const func = (0, context_1.mockClosure)();
const builtin = (x) => x;
const obj = { a: 1 };
const arr = [2];
const mockValues = [num, bool, str, func, builtin, obj, arr, undefined, null];
describe('Unary type combinations:', () => {
    const valid = [
        ['!', bool],
        ['+', num],
        ['-', num]
    ];
    const operators = ['!', '+', '-'];
    const invalid = [];
    operators.forEach(op => {
        mockValues.forEach(value => {
            if (!valid.some(combination => combination[0] === op && combination[1] === value)) {
                invalid.push([op, value]);
            }
        });
    });
    test('Valid type combinations are OK', () => {
        valid.forEach(([operator, value]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkUnaryExpression(node, operator, value);
            expect(error).toBeUndefined();
        });
    });
    test('Invalid type combinations return TypeError', () => {
        invalid.forEach(([operator, value]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkUnaryExpression(node, operator, value);
            expect(error).toBeInstanceOf(rttc.TypeError);
            expect({
                operator,
                value,
                explain: error.explain(),
                elaborate: error.elaborate()
            }).toMatchSnapshot();
        });
    });
});
describe('Binary + type combinations:', () => {
    const valid = [
        ['+', num, num],
        ['+', str, str]
    ];
    const operators = ['+'];
    const invalid = [];
    operators.forEach(op => {
        mockValues.forEach(left => {
            mockValues.forEach(right => {
                if (!valid.some(combination => combination[0] === op && combination[1] === left && combination[2] === right)) {
                    invalid.push([op, left, right]);
                }
            });
        });
    });
    test('Valid type combinations are OK', () => {
        valid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeUndefined();
        });
    });
    test('Invalid type combinations return TypeError', () => {
        invalid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeInstanceOf(rttc.TypeError);
            expect({
                operator,
                left,
                right,
                explain: error.explain(),
                elaborate: error.elaborate()
            }).toMatchSnapshot();
        });
    });
});
describe('Binary (-|*|/|%) type combinations:', () => {
    const valid = [
        ['-', num, num],
        ['*', num, num],
        ['/', num, num],
        ['%', num, num]
    ];
    const operators = ['-', '*', '/', '%'];
    const invalid = [];
    operators.forEach(op => {
        mockValues.forEach(left => {
            mockValues.forEach(right => {
                if (!valid.some(combination => combination[0] === op && combination[1] === left && combination[2] === right)) {
                    invalid.push([op, left, right]);
                }
            });
        });
    });
    test('Valid type combinations are OK', () => {
        valid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeUndefined();
        });
    });
    test('Invalid type combinations return TypeError', () => {
        invalid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeInstanceOf(rttc.TypeError);
            expect({
                operator,
                left,
                right,
                explain: error.explain(),
                elaborate: error.elaborate()
            }).toMatchSnapshot();
        });
    });
});
describe('Binary (===|!==) type combinations:', () => {
    const valid = [];
    const operators = ['===', '!=='];
    const invalid = [];
    // Every combination is valid
    operators.forEach(op => {
        mockValues.forEach(left => {
            mockValues.forEach(right => {
                valid.push([op, left, right]);
            });
        });
    });
    test('Valid type combinations are OK', () => {
        valid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeUndefined();
        });
    });
    test('Invalid type combinations return TypeError', () => {
        invalid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeInstanceOf(rttc.TypeError);
            expect({
                operator,
                left,
                right,
                explain: error.explain(),
                elaborate: error.elaborate()
            }).toMatchSnapshot();
        });
    });
});
describe('Binary (<|>|<=|>=) type combinations:', () => {
    const valid = [
        ['<', num, num],
        ['<', str, str],
        ['>', num, num],
        ['>', str, str],
        ['<=', num, num],
        ['<=', str, str],
        ['>=', num, num],
        ['>=', str, str]
    ];
    const operators = ['<', '>', '<=', '>='];
    const invalid = [];
    operators.forEach(op => {
        mockValues.forEach(left => {
            mockValues.forEach(right => {
                if (!valid.some(combination => combination[0] === op && combination[1] === left && combination[2] === right)) {
                    invalid.push([op, left, right]);
                }
            });
        });
    });
    test('Valid type combinations are OK', () => {
        valid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeUndefined();
        });
    });
    test('Invalid type combinations return TypeError', () => {
        invalid.forEach(([operator, left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkBinaryExpression(node, operator, 4, left, right);
            expect(error).toBeInstanceOf(rttc.TypeError);
            expect({
                operator,
                left,
                right,
                explain: error.explain(),
                elaborate: error.elaborate()
            }).toMatchSnapshot();
        });
    });
});
describe('Ternary/if test expression type combinations:', () => {
    const valid = [bool];
    const invalid = [];
    mockValues.forEach(value => {
        if (!valid.some(combination => combination === value)) {
            invalid.push(value);
        }
    });
    test('Valid type combinations are OK', () => {
        valid.forEach((value) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkIfStatement(node, value);
            expect(error).toBeUndefined();
        });
    });
    test('Invalid type combinations return TypeError', () => {
        invalid.forEach((value) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkIfStatement(node, value);
            expect(error).toBeInstanceOf(rttc.TypeError);
            expect({
                value,
                explain: error.explain(),
                elaborate: error.elaborate()
            }).toMatchSnapshot();
        });
    });
});
describe('Member expression type combinations:', () => {
    const valid = [
        [obj, str],
        [arr, num]
    ];
    const invalid = [];
    mockValues.forEach(left => {
        mockValues.forEach(right => {
            if (!valid.some(combination => combination[0] === left && combination[1] === right)) {
                invalid.push([left, right]);
            }
        });
    });
    // Extra tests for array indices integral check.
    valid.push([arr, 0]);
    valid.push([arr, 10]);
    valid.push([arr, 2 ** 32 - 2]);
    invalid.push([arr, -1]);
    invalid.push([arr, 0.5]);
    invalid.push([arr, 2 ** 32 - 1]);
    test('Valid type combinations are OK', () => {
        valid.forEach(([left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkMemberAccess(node, left, right);
            expect(error).toBeUndefined();
        });
    });
    test('Invalid type combinations return TypeError', () => {
        invalid.forEach(([left, right]) => {
            const context = (0, context_1.mockRuntimeContext)();
            const node = context.runtime.nodes[0];
            const error = rttc.checkMemberAccess(node, left, right);
            expect(error).toBeInstanceOf(rttc.TypeError);
            expect({
                left,
                right,
                explain: error.explain(),
                elaborate: error.elaborate()
            }).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=rttc.js.map