"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ace = require("ace-builds");
const mode_javascript_1 = require("ace-builds/src-noconflict/mode-javascript");
const source_1 = require("../editors/ace/modes/source");
// suppress all console warning
console.warn = () => {
    return null;
};
// default chapter variant and external library
const defaultVariant = 'default';
const defaultExternal = 'NONE';
// define session
const session = ace.createEditSession('', mode_javascript_1.default);
// tested token types
const CATEGORY = {
    functions: /\bsupport.function\b/,
    types: /\bstorage.type\b/,
    forbidden: /\bvariable.language\b/,
    keywords: /\bkeyword\b/,
    consts: /\bbuiltinconsts\b/,
    number: /\bconstant.numeric\b/,
    bool: /\bconstant.language.boolean\b/
};
const setSession = (chapter, variant, external, code) => {
    // load the library
    (0, source_1.HighlightRulesSelector)(chapter, variant, external);
    (0, source_1.ModeSelector)(chapter, variant, external);
    // set mode and value
    session.setMode('ace/mode/source' + chapter.toString() + variant + external);
    session.setValue(code);
};
const expectedBool = (token, type) => {
    return token !== null && type.test(token.type);
};
test('function token type error', () => {
    const code = `const p = pair(3, 4); \nset_tail(p, 3);`;
    setSession(2, defaultVariant, defaultExternal, code);
    const token1 = session.getTokenAt(0, 11);
    const token2 = session.getTokenAt(1, 3);
    // at source 2, pair is function but set_tail is not
    expect(expectedBool(token1, CATEGORY.functions)).toBe(true);
    expect(expectedBool(token2, CATEGORY.functions)).toBe(false);
    // at source 4, set_tail is function as well
    setSession(4, defaultVariant, defaultExternal, code);
    const newToken1 = session.getTokenAt(0, 11);
    const newToken2 = session.getTokenAt(1, 3);
    expect(expectedBool(newToken1, CATEGORY.functions)).toBe(true);
    expect(expectedBool(newToken2, CATEGORY.functions)).toBe(true);
});
test('constants are not correctly loaded', () => {
    const code = `true; \n5; \nmath_LOG2E;`;
    setSession(1, defaultVariant, defaultExternal, code);
    const token1 = session.getTokenAt(0, 1);
    expect(expectedBool(token1, CATEGORY.bool)).toBe(true);
    const token2 = session.getTokenAt(1, 1);
    expect(expectedBool(token2, CATEGORY.number)).toBe(true);
    const token3 = session.getTokenAt(2, 1);
    expect(expectedBool(token3, CATEGORY.consts)).toBe(true);
});
test('operator syntax type error', () => {
    const code = 'const num = 3; \nnum++; \nnum--; \nnum += 1;';
    setSession(1, defaultVariant, defaultExternal, code);
    const token1 = session.getTokenAt(1, 4);
    expect(expectedBool(token1, CATEGORY.forbidden)).toBe(true);
    const token2 = session.getTokenAt(2, 4);
    expect(expectedBool(token2, CATEGORY.forbidden)).toBe(true);
    const token3 = session.getTokenAt(3, 5);
    expect(expectedBool(token3, CATEGORY.forbidden)).toBe(true);
});
test('forbidden keywords', () => {
    const code = 'let x = 3; \nwhile (x > 0) { x = x - 1; }';
    // not allowed in source 1
    setSession(1, defaultVariant, defaultExternal, code);
    const token1 = session.getTokenAt(0, 1);
    expect(expectedBool(token1, CATEGORY.forbidden)).toBe(true);
    const token2 = session.getTokenAt(1, 1);
    expect(expectedBool(token2, CATEGORY.forbidden)).toBe(true);
    // allowed in source 4
    setSession(4, defaultVariant, defaultExternal, code);
    const newToken1 = session.getTokenAt(0, 1);
    expect(expectedBool(newToken1, CATEGORY.types)).toBe(true);
    const newToken2 = session.getTokenAt(1, 1);
    expect(expectedBool(newToken2, CATEGORY.keywords)).toBe(true);
});
test('forbidden JavaScript reserved words', () => {
    const code = `private \npackage \nthis`;
    setSession(4, defaultVariant, defaultExternal, code);
    const token1 = session.getTokenAt(0, 1);
    expect(expectedBool(token1, CATEGORY.forbidden)).toBe(true);
    const token2 = session.getTokenAt(1, 1);
    expect(expectedBool(token2, CATEGORY.forbidden)).toBe(true);
    const token3 = session.getTokenAt(2, 1);
    expect(expectedBool(token3, CATEGORY.forbidden)).toBe(true);
});
/*
test('external library functions are not correctly loaded', () => {
  const code = `const rune = blank; \nindigo(rune);`

  setSession(1, defaultVariant, 'RUNE', code)

  const token1 = session.getTokenAt(0, 15)
  expect(expectedBool(token1, CATEGORY.consts)).toBe(true)

  const token2 = session.getTokenAt(1, 1)
  expect(expectedBool(token2, CATEGORY.functions)).toBe(true)
})
*/
//# sourceMappingURL=mode.js.map