"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
test('handles if without else', () => {
    const context = (0, __1.createContext)(3);
    const compiled = (0, __1.compile)(`if (true) { 1 + 1; }`, context);
    expect(compiled).toMatchInlineSnapshot(`
    Array [
      0,
      Array [
        Array [
          2,
          0,
          0,
          Array [
            Array [
              10,
            ],
            Array [
              61,
              5,
            ],
            Array [
              2,
              1,
            ],
            Array [
              2,
              1,
            ],
            Array [
              17,
            ],
            Array [
              62,
              2,
            ],
            Array [
              11,
            ],
            Array [
              70,
            ],
          ],
        ],
      ],
    ]
  `);
});
//# sourceMappingURL=svml-compiler.js.map