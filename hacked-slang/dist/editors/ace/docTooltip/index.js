"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceDocumentation = void 0;
const ext_lib = require("./External libraries.json");
const source_1 = require("./source_1.json");
const source_2 = require("./source_2.json");
const source_3 = require("./source_3.json");
const source_3_concurrent = require("./source_3_concurrent.json");
const source_3_non_det = require("./source_3_non-det.json");
const source_4 = require("./source_4.json");
exports.SourceDocumentation = {
    builtins: {
        '1': source_1,
        '1_lazy': source_1,
        '2': source_2,
        '2_lazy': source_2,
        '3': source_3,
        '3_concurrent': source_3_concurrent,
        '3_non-det': source_3_non_det,
        '4': source_4
    },
    ext_lib
};
//# sourceMappingURL=index.js.map