"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatters_1 = require("../../utils/formatters");
const testing_1 = require("../../utils/testing");
test('pair creates pair', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    is_pair (pair(1, 'a string ""'));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('head works', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    head(pair(1, 'a string ""'));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`1`);
});
test('tail works', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    tail(pair(1, 'a string ""'));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"a string \\"\\""`);
});
test('tail of a 1 element list is null', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    tail(list(1));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`null`);
});
test('empty list is null', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    list();
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot('null');
});
test('for_each', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    let sum = 0;
    for_each(x => {
      sum = sum + x;
    }, list(1, 2, 3));
    sum;
    `, { chapter: 3, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`6`);
});
test('map', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(map(x => 2 * x, list(12, 11, 3)), list(24, 22, 6));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('filter', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(filter(x => x <= 4, list(2, 10, 1000, 1, 3, 100, 4, 5, 2, 1000)), list(2, 1, 3, 4, 2));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('build_list', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(build_list(x => x * x, 5), list(0, 1, 4, 9, 16));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('reverse', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(reverse(list("string", "null", "undefined", "null", 123)), list(123, "null", "undefined", "null", "string"));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('append', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(append(list(123, 123), list(456, 456, 456)), list(123, 123, 456, 456, 456));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('member', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(
      member(4, list(1, 2, 3, 4, 123, 456, 789)),
      list(4, 123, 456, 789));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('remove', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    remove(1, list(1));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`null`);
});
test('remove not found', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal (remove(2, list(1)),list(1));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('remove_all', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(remove_all(1, list(1, 2, 3, 4, 1, 1, 1, 5, 1, 1, 6)), list(2, 3, 4, 5, 6));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('remove_all not found', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(remove_all(1, list(2, 3, 4)), list(2, 3, 4));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('enum_list', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(enum_list(1, 5), list(1, 2, 3, 4, 5));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('enum_list with floats', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    equal(enum_list(1.5, 5), list(1.5, 2.5, 3.5, 4.5));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('list_ref', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    list_ref(list(1, 2, 3, "4", 4), 4);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`4`);
});
test('accumulate', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    accumulate((curr, acc) => curr + acc, 0, list(2, 3, 4, 1));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`10`);
});
test('list_to_string', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    list_to_string(list(1, 2, 3));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"[1,[2,[3,null]]]"`);
});
test('bad number error build_list', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    build_list(x => x, '1');
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 45: Expected number on left hand side of operation, got string."`);
});
test('bad number error enum_list', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    enum_list('1', '5');
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 139: Expected string on right hand side of operation, got number."`);
});
test('bad number error enum_list', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    enum_list('1', 5);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 139: Expected string on right hand side of operation, got number."`);
});
test('bad number error enum_list', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    enum_list(1, '5');
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 140: Expected number on right hand side of operation, got string."`);
});
test('bad index error list_ref', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    list_ref(list(1, 2, 3), 3);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 148: Error: tail(xs) expects a pair as argument xs, but encountered null"`);
});
test('bad index error list_ref', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    list_ref(list(1, 2, 3), -1);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 148: Error: tail(xs) expects a pair as argument xs, but encountered null"`);
});
test('bad index error list_ref', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    list_ref(list(1, 2, 3), 1.5);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 148: Error: tail(xs) expects a pair as argument xs, but encountered null"`);
});
test('bad index error list_ref', () => {
    return (0, testing_1.expectParsedError)((0, formatters_1.stripIndent) `
    list_ref(list(1, 2, 3), '1');
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`"Line 149: Expected string on right hand side of operation, got number."`);
});
test('arguments are not evaluated for pair', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    head(pair(1,head(null)));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`1`);
});
test('arguments are not evaluated for list', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    head(list(1,head(null)));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`1`);
});
test('recursive pair definitions are possible (tail)', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair (1,a);
    head(a) + head(tail(a));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`2`);
});
test('recursive pair definitions are possible (head)', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair (a,1);
    tail(a) + tail(head(a));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`2`);
});
test('recursive list definitions are possible (head)', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = list (1,a);
    head(a) + head(head(tail(a)));
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`2`);
});
test('is_list on infinite lists works', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = list(1,a);
    is_list(a);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`true`);
});
test('list_ref on infinite lists', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,a);
    list_ref(a,200);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`1`);
});
test('map on infinite lists works', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,a);
    const b = map(x => 2 * x, a);
    list_ref(b,200);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`2`);
});
test('map on infinite lists works', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,a);
    const b = map(x => 2 * x, a);
    list_ref(b,200);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`2`);
});
test('append left list is infinite', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,a);
    const b = append(a, list(3,4));
    list_ref(b,200);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`1`);
});
test('append right list is infinite', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,a);
    const b = append(list(3,4),a);
    list_ref(b,200);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`1`);
});
test('remove on infinite list', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,a);
    const b = remove(1,a);
    list_ref(b,200);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`1`);
});
test('remove all ones on infinite list of ones and twos', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,pair(2,a));
    const b = remove_all(1,a);
    list_ref(b,200);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`2`);
});
test('filter on infinite lists', () => {
    return (0, testing_1.expectResult)((0, formatters_1.stripIndent) `
    const a = pair(1,pair(2,a));
    const b = filter(x => x % 2 === 0,a);
    list_ref(b,1);
    `, { chapter: 2, native: true, variant: 'lazy' }).toMatchInlineSnapshot(`2`);
});
//# sourceMappingURL=lazyLists.js.map