"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("../utils/testing");
test('draw_data returns first argument if more than one argument', () => {
    return (0, testing_1.expectResult)(`draw_data(1, 2);`, { chapter: 3 }).toMatchInlineSnapshot(`1`);
});
test('draw_data returns first argument if exactly one argument', () => {
    return (0, testing_1.expectResult)(`draw_data(1);`, { chapter: 3 }).toMatchInlineSnapshot(`1`);
});
test('draw_data with no arguments throws error', () => {
    return (0, testing_1.expectParsedError)(`draw_data();`, { chapter: 3 }).toMatchInlineSnapshot(`"Line 1: Expected 1 or more arguments, but got 0."`);
});
//# sourceMappingURL=draw_data.js.map