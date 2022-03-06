"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svml_assembler_1 = require("../svml-assembler");
test('assemble', () => {
    expect((0, svml_assembler_1.assemble)([
        0,
        [
            [
                4,
                3,
                0,
                [
                    [40, [1]],
                    [45, 0],
                    [11],
                    [14],
                    [2, 1],
                    [66, 5, 1],
                    [14],
                    [2, 1],
                    [6, 1.5],
                    [17],
                    [14],
                    [42, 0],
                    [2, 1],
                    [64, 1],
                    [14],
                    [41],
                    [75],
                    [2, 0],
                    [2, 1],
                    [57],
                    [75],
                    [2, 1],
                    [2, 2],
                    [57],
                    [75],
                    [2, 2],
                    [2, 3],
                    [57],
                    [14],
                    [10],
                    [9],
                    [37],
                    [14],
                    [2, 2],
                    [2, 3],
                    [29],
                    [14],
                    [2, 3],
                    [6, 4.5],
                    [33],
                    [14],
                    [11],
                    [12],
                    [31],
                    [14],
                    [11],
                    [12],
                    [35],
                    [14],
                    [12],
                    [4, 0 / 0],
                    [82],
                    [14],
                    [4, 1 / 0],
                    [4, 0 / 0],
                    [19],
                    [14],
                    [2, 1],
                    [2, 2],
                    [23],
                    [14],
                    [2, 3],
                    [2, 4],
                    [25],
                    [14],
                    [2, 5],
                    [2, 6],
                    [19],
                    [14],
                    [2, 7],
                    [2, 8],
                    [21],
                    [14],
                    [2, 1],
                    [45, 1],
                    [11],
                    [14],
                    [40, [2]],
                    [45, 2],
                    [11],
                    [14],
                    [42, 2],
                    [2, 1],
                    [64, 1],
                    [14],
                    [9],
                    [27],
                    [70]
                ]
            ],
            [1, 1, 1, [[42, 0], [69, 0, 1], [70]]],
            [
                4,
                3,
                1,
                [
                    [2, 1],
                    [45, 1],
                    [11],
                    [14],
                    [42, 1],
                    [45, 0],
                    [11],
                    [14],
                    [42, 0],
                    [2, 1],
                    [17],
                    [45, 0],
                    [11],
                    [14],
                    [41],
                    [75],
                    [2, 0],
                    [2, 1],
                    [57],
                    [75],
                    [2, 1],
                    [2, 2],
                    [57],
                    [75],
                    [2, 2],
                    [2, 3],
                    [57],
                    [45, 0],
                    [11],
                    [14],
                    [42, 0],
                    [2, 1],
                    [42, 0],
                    [2, 0],
                    [54],
                    [57],
                    [11],
                    [14],
                    [42, 0],
                    [2, 2],
                    [54],
                    [51, 1, 1],
                    [11],
                    [14],
                    [2, 0],
                    [45, 2],
                    [11],
                    [14],
                    [42, 2],
                    [48, 1, 1],
                    [29],
                    [61, 28],
                    [76, 3],
                    [48, 2, 1],
                    [45, 0],
                    [11],
                    [14],
                    [42, 0],
                    [45, 1],
                    [11],
                    [14],
                    [2, 5],
                    [45, 2],
                    [11],
                    [14],
                    [42, 2],
                    [48, 1, 1],
                    [17],
                    [45, 2],
                    [11],
                    [14],
                    [48, 2, 1],
                    [2, 1],
                    [17],
                    [51, 2, 1],
                    [11],
                    [14],
                    [77],
                    [62, -30],
                    [11],
                    [14],
                    [9],
                    [61, 5],
                    [42, 1],
                    [80],
                    [67, 5, 1],
                    [62, 4],
                    [48, 0, 1],
                    [42, 1],
                    [65, 1],
                    [70]
                ]
            ]
        ]
    ])).toEqual(new Uint8Array([
        0xad, 0xac, 0x05, 0x50, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x04, 0x03, 0x00, 0x00, 0x28, 0xf4, 0x00, 0x00, 0x00, 0x2d, 0x00, 0x0b, 0x0e, 0x02,
        0x01, 0x00, 0x00, 0x00, 0x42, 0x05, 0x01, 0x0e, 0x02, 0x01, 0x00, 0x00, 0x00, 0x06, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0x3f, 0x11, 0x0e, 0x2a, 0x00, 0x02, 0x01, 0x00, 0x00,
        0x00, 0x40, 0x01, 0x0e, 0x29, 0x4b, 0x02, 0x00, 0x00, 0x00, 0x00, 0x02, 0x01, 0x00, 0x00,
        0x00, 0x39, 0x4b, 0x02, 0x01, 0x00, 0x00, 0x00, 0x02, 0x02, 0x00, 0x00, 0x00, 0x39, 0x4b,
        0x02, 0x02, 0x00, 0x00, 0x00, 0x02, 0x03, 0x00, 0x00, 0x00, 0x39, 0x0e, 0x0a, 0x09, 0x25,
        0x0e, 0x02, 0x02, 0x00, 0x00, 0x00, 0x02, 0x03, 0x00, 0x00, 0x00, 0x1d, 0x0e, 0x02, 0x03,
        0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x12, 0x40, 0x21, 0x0e, 0x0b,
        0x0c, 0x1f, 0x0e, 0x0b, 0x0c, 0x23, 0x0e, 0x0c, 0x04, 0x00, 0x00, 0xc0, 0x7f, 0x52, 0x0e,
        0x04, 0x00, 0x00, 0x80, 0x7f, 0x04, 0x00, 0x00, 0xc0, 0x7f, 0x13, 0x0e, 0x02, 0x01, 0x00,
        0x00, 0x00, 0x02, 0x02, 0x00, 0x00, 0x00, 0x17, 0x0e, 0x02, 0x03, 0x00, 0x00, 0x00, 0x02,
        0x04, 0x00, 0x00, 0x00, 0x19, 0x0e, 0x02, 0x05, 0x00, 0x00, 0x00, 0x02, 0x06, 0x00, 0x00,
        0x00, 0x13, 0x0e, 0x02, 0x07, 0x00, 0x00, 0x00, 0x02, 0x08, 0x00, 0x00, 0x00, 0x15, 0x0e,
        0x02, 0x01, 0x00, 0x00, 0x00, 0x2d, 0x01, 0x0b, 0x0e, 0x28, 0x00, 0x01, 0x00, 0x00, 0x2d,
        0x02, 0x0b, 0x0e, 0x2a, 0x02, 0x02, 0x01, 0x00, 0x00, 0x00, 0x40, 0x01, 0x0e, 0x09, 0x1b,
        0x46, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x2a, 0x00, 0x45, 0x00, 0x01, 0x46, 0x00,
        0x00, 0x04, 0x03, 0x01, 0x00, 0x02, 0x01, 0x00, 0x00, 0x00, 0x2d, 0x01, 0x0b, 0x0e, 0x2a,
        0x01, 0x2d, 0x00, 0x0b, 0x0e, 0x2a, 0x00, 0x02, 0x01, 0x00, 0x00, 0x00, 0x11, 0x2d, 0x00,
        0x0b, 0x0e, 0x29, 0x4b, 0x02, 0x00, 0x00, 0x00, 0x00, 0x02, 0x01, 0x00, 0x00, 0x00, 0x39,
        0x4b, 0x02, 0x01, 0x00, 0x00, 0x00, 0x02, 0x02, 0x00, 0x00, 0x00, 0x39, 0x4b, 0x02, 0x02,
        0x00, 0x00, 0x00, 0x02, 0x03, 0x00, 0x00, 0x00, 0x39, 0x2d, 0x00, 0x0b, 0x0e, 0x2a, 0x00,
        0x02, 0x01, 0x00, 0x00, 0x00, 0x2a, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x36, 0x39, 0x0b,
        0x0e, 0x2a, 0x00, 0x02, 0x02, 0x00, 0x00, 0x00, 0x36, 0x33, 0x01, 0x01, 0x0b, 0x0e, 0x02,
        0x00, 0x00, 0x00, 0x00, 0x2d, 0x02, 0x0b, 0x0e, 0x2a, 0x02, 0x30, 0x01, 0x01, 0x1d, 0x3d,
        0x36, 0x00, 0x00, 0x00, 0x4c, 0x03, 0x30, 0x02, 0x01, 0x2d, 0x00, 0x0b, 0x0e, 0x2a, 0x00,
        0x2d, 0x01, 0x0b, 0x0e, 0x02, 0x05, 0x00, 0x00, 0x00, 0x2d, 0x02, 0x0b, 0x0e, 0x2a, 0x02,
        0x30, 0x01, 0x01, 0x11, 0x2d, 0x02, 0x0b, 0x0e, 0x30, 0x02, 0x01, 0x02, 0x01, 0x00, 0x00,
        0x00, 0x11, 0x33, 0x02, 0x01, 0x0b, 0x0e, 0x4d, 0x3e, 0xbf, 0xff, 0xff, 0xff, 0x0b, 0x0e,
        0x09, 0x3d, 0x0b, 0x00, 0x00, 0x00, 0x2a, 0x01, 0x50, 0x43, 0x05, 0x01, 0x3e, 0x07, 0x00,
        0x00, 0x00, 0x30, 0x00, 0x01, 0x2a, 0x01, 0x41, 0x01, 0x46
    ]));
});
//# sourceMappingURL=svml-assembler.js.map