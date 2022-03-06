"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../../mocks/context");
const parser_1 = require("../../parser/parser");
const formatters_1 = require("../../utils/formatters");
const transpiler_1 = require("../transpiler");
jest.mock('../../modules/moduleLoader', () => (Object.assign(Object.assign({}, jest.requireActual('../../modules/moduleLoader')), { memoizedGetModuleFile: () => 'undefined;' })));
test('Transform single import decalration', () => {
    const code = `import { foo, bar } from "test/one_module";`;
    const context = (0, context_1.mockContext)(4);
    const program = (0, parser_1.parse)(code, context);
    const result = (0, transpiler_1.transformSingleImportDeclaration)(123, program.body[0]);
    const names = result.map(decl => decl.declarations[0].id.name);
    expect(names[0]).toStrictEqual('foo');
    expect(names[1]).toStrictEqual('bar');
});
test('Transform import decalrations variable decalarations', () => {
    const code = (0, formatters_1.stripIndent) `
    import { foo } from "test/one_module";
    import { bar } from "test/another_module";
    foo(bar);
  `;
    const context = (0, context_1.mockContext)(4);
    const program = (0, parser_1.parse)(code, context);
    (0, transpiler_1.transformImportDeclarations)(program);
    expect(program.body[0].type).toBe('VariableDeclaration');
    expect(program.body[1].type).toBe('VariableDeclaration');
});
test('checkForUndefinedVariables accounts for import statements', () => {
    const code = (0, formatters_1.stripIndent) `
    import { hello } from "module";
    hello;
  `;
    const context = (0, context_1.mockContext)(4);
    const program = (0, parser_1.parse)(code, context);
    (0, transpiler_1.transpile)(program, context, false);
});
//# sourceMappingURL=modules.js.map