"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullJSRunner = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const acorn_1 = require("acorn");
const astring_1 = require("astring");
const constants_1 = require("../constants");
const runtimeSourceError_1 = require("../errors/runtimeSourceError");
const parser_1 = require("../parser/parser");
const transpiler_1 = require("../transpiler/transpiler");
const create = require("../utils/astCreator");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const FULL_JS_PARSER_OPTIONS = {
    sourceType: 'module',
    ecmaVersion: 'latest',
    locations: true
};
/**
 * Parse code string into AST
 * - any errors in the process of parsing will be added to the context
 *
 * @param code
 * @param context
 * @returns AST of code if there are no syntax errors, otherwise undefined
 */
function parseFullJS(code, context) {
    let program;
    try {
        program = (0, acorn_1.parse)(code, FULL_JS_PARSER_OPTIONS);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            const loc = error.loc;
            const location = {
                start: { line: loc.line, column: loc.column },
                end: { line: loc.line, column: loc.column + 1 }
            };
            context.errors.push(new parser_1.FatalSyntaxError(location, error.toString()));
        }
    }
    return program;
}
function fullJSEval(code, nativeStorage, moduleParams, moduleContexts) {
    if (nativeStorage.evaller) {
        return nativeStorage.evaller(code);
    }
    else {
        return eval(code);
    }
}
function preparePrelude(context) {
    if (context.prelude === null) {
        return [];
    }
    const prelude = context.prelude;
    context.prelude = null;
    const program = parseFullJS(prelude, context);
    return program.body;
}
function containsPrevEval(context) {
    return context.nativeStorage.evaller != null;
}
function fullJSRunner(code, context, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // parse + check for syntax errors
        const program = parseFullJS(code, context);
        if (!program) {
            return utils_1.resolvedErrorPromise;
        }
        // prelude & builtins
        // only process builtins and preludes if it is a fresh eval context
        const preludeAndBuiltins = containsPrevEval(context)
            ? []
            : [...(0, transpiler_1.getBuiltins)(context.nativeStorage), ...preparePrelude(context)];
        // modules
        (0, transpiler_1.hoistImportDeclarations)(program);
        let modulePrefix;
        try {
            (0, utils_1.appendModulesToContext)(program, context);
            modulePrefix = (0, transpiler_1.prefixModule)(program);
        }
        catch (error) {
            context.errors.push(error instanceof runtimeSourceError_1.RuntimeSourceError ? error : yield (0, errors_1.toSourceError)(error));
            return utils_1.resolvedErrorPromise;
        }
        const preEvalProgram = create.program([
            ...preludeAndBuiltins,
            (0, transpiler_1.evallerReplacer)(create.identifier(constants_1.NATIVE_STORAGE_ID), new Set())
        ]);
        const preEvalCode = (0, astring_1.generate)(preEvalProgram) + modulePrefix;
        yield fullJSEval(preEvalCode, context.nativeStorage, options, context.moduleContexts);
        const { transpiled, sourceMapJson } = (0, transpiler_1.transpile)(program, context);
        try {
            return Promise.resolve({
                status: 'finished',
                context,
                value: yield fullJSEval(transpiled, context.nativeStorage, options, context.moduleContexts)
            });
        }
        catch (error) {
            context.errors.push(yield (0, errors_1.toSourceError)(error, sourceMapJson));
            return utils_1.resolvedErrorPromise;
        }
    });
}
exports.fullJSRunner = fullJSRunner;
//# sourceMappingURL=fullJSRunner.js.map