"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify_1 = require("../stringify");
describe('stringify', () => {
    test('works with arrays with holes', () => {
        {
            const a = [];
            a[1] = [];
            expect((0, stringify_1.stringify)(a)).toMatchInlineSnapshot(`"[undefined, []]"`);
        }
        {
            const a = [];
            a[2] = [];
            expect((0, stringify_1.stringify)(a)).toMatchInlineSnapshot(`"[undefined, undefined, []]"`);
        }
        {
            const a = [];
            a[3] = [];
            expect((0, stringify_1.stringify)(a)).toMatchInlineSnapshot(`"[undefined, undefined, undefined, []]"`);
        }
    });
});
//# sourceMappingURL=stringify.js.map