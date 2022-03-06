"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvedErrorPromise = exports.hasVerboseErrors = exports.appendModulesToContext = exports.determineExecutionMethod = exports.determineVariant = exports.isFullJSChapter = void 0;
const moduleLoader_1 = require("../modules/moduleLoader");
const parser_1 = require("../parser/parser");
const inspector_1 = require("../stdlib/inspector");
const walkers_1 = require("../utils/walkers");
// Context Utils
function isFullJSChapter(chapter) {
    return chapter == -1;
}
exports.isFullJSChapter = isFullJSChapter;
/**
 * Small function to determine the variant to be used
 * by a program, as both context and options can have
 * a variant. The variant provided in options will
 * have precedence over the variant provided in context.
 *
 * @param context The context of the program.
 * @param options Options to be used when
 *                running the program.
 *
 * @returns The variant that the program is to be run in
 */
function determineVariant(context, options) {
    if (options.variant) {
        return options.variant;
    }
    else {
        return context.variant;
    }
}
exports.determineVariant = determineVariant;
function determineExecutionMethod(theOptions, context, program, verboseErrors) {
    let isNativeRunnable;
    if (theOptions.executionMethod === 'auto') {
        if (context.executionMethod === 'auto') {
            if (verboseErrors) {
                isNativeRunnable = false;
            }
            else if ((0, inspector_1.areBreakpointsSet)()) {
                isNativeRunnable = false;
            }
            else {
                let hasDeuggerStatement = false;
                (0, walkers_1.simple)(program, {
                    DebuggerStatement(node) {
                        hasDeuggerStatement = true;
                    }
                });
                isNativeRunnable = !hasDeuggerStatement;
            }
            context.executionMethod = isNativeRunnable ? 'native' : 'interpreter';
        }
        else {
            isNativeRunnable = context.executionMethod === 'native';
        }
    }
    else {
        isNativeRunnable = theOptions.executionMethod === 'native';
        context.executionMethod = theOptions.executionMethod;
    }
    return isNativeRunnable;
}
exports.determineExecutionMethod = determineExecutionMethod;
/**
 * Add UI tabs needed for modules to program context
 *
 * @param program AST of program to be ran
 * @param context The context of the program
 */
function appendModulesToContext(program, context) {
    for (const node of program.body) {
        if (node.type !== 'ImportDeclaration')
            break;
        const moduleName = node.source.value.trim();
        // Load the module's tabs
        if (!context.moduleContexts.has(moduleName)) {
            const moduleContext = {
                state: null,
                tabs: (0, moduleLoader_1.loadModuleTabs)(moduleName)
            };
            context.moduleContexts.set(moduleName, moduleContext);
        }
        else {
            context.moduleContexts.get(moduleName).tabs = (0, moduleLoader_1.loadModuleTabs)(moduleName);
        }
    }
}
exports.appendModulesToContext = appendModulesToContext;
// AST Utils
function hasVerboseErrors(theCode) {
    const theProgramFirstExpression = (0, parser_1.parseAt)(theCode, 0);
    if (theProgramFirstExpression && theProgramFirstExpression.type === 'Literal') {
        return theProgramFirstExpression.value === 'enable verbose';
    }
    return false;
}
exports.hasVerboseErrors = hasVerboseErrors;
exports.resolvedErrorPromise = Promise.resolve({ status: 'error' });
//# sourceMappingURL=utils.js.map