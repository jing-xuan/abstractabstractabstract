"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACORN_PARSE_OPTIONS = exports.sourceLanguages = exports.JSSLANG_PROPERTIES = exports.UNKNOWN_LOCATION = exports.MAX_LIST_DISPLAY_LENGTH = exports.MODULE_CONTEXTS_ID = exports.MODULE_PARAMS_ID = exports.NATIVE_STORAGE_ID = exports.GLOBAL = exports.TRY_AGAIN = exports.CUT = void 0;
exports.CUT = 'cut'; // cut operator for Source 4.3
exports.TRY_AGAIN = 'retry'; // command for Source 4.3
exports.GLOBAL = typeof window === 'undefined' ? global : window;
exports.NATIVE_STORAGE_ID = 'nativeStorage';
exports.MODULE_PARAMS_ID = 'moduleParams';
exports.MODULE_CONTEXTS_ID = 'moduleContexts';
exports.MAX_LIST_DISPLAY_LENGTH = 100;
exports.UNKNOWN_LOCATION = {
    start: {
        line: -1,
        column: -1
    },
    end: {
        line: -1,
        column: -1
    }
};
exports.JSSLANG_PROPERTIES = {
    maxExecTime: 1000,
    factorToIncreaseBy: 10
};
exports.sourceLanguages = [
    { chapter: 1, variant: 'default' },
    { chapter: 1, variant: 'wasm' },
    { chapter: 1, variant: 'lazy' },
    { chapter: 2, variant: 'default' },
    { chapter: 2, variant: 'lazy' },
    { chapter: 3, variant: 'default' },
    { chapter: 3, variant: 'concurrent' },
    { chapter: 3, variant: 'non-det' },
    { chapter: 4, variant: 'default' },
    { chapter: 4, variant: 'gpu' }
];
exports.ACORN_PARSE_OPTIONS = { ecmaVersion: 2015 };
//# sourceMappingURL=constants.js.map