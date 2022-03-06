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
exports.sourceRunner = void 0;
const constants_1 = require("../constants");
const errors_1 = require("../errors/errors");
const runtimeSourceError_1 = require("../errors/runtimeSourceError");
const timeoutErrors_1 = require("../errors/timeoutErrors");
const gpu_1 = require("../gpu/gpu");
const errors_2 = require("../infiniteLoops/errors");
const runtime_1 = require("../infiniteLoops/runtime");
const interpreter_1 = require("../interpreter/interpreter");
const interpreter_non_det_1 = require("../interpreter/interpreter-non-det");
const lazy_1 = require("../lazy/lazy");
const parser_1 = require("../parser/parser");
const schedulers_1 = require("../schedulers");
const stepper_1 = require("../stepper/stepper");
const evalContainer_1 = require("../transpiler/evalContainer");
const transpiler_1 = require("../transpiler/transpiler");
const operators_1 = require("../utils/operators");
const validator_1 = require("../validator/validator");
const svml_compiler_1 = require("../vm/svml-compiler");
const svml_machine_1 = require("../vm/svml-machine");
const _1 = require(".");
const errors_3 = require("./errors");
const utils_1 = require("./utils");
const DEFAULT_SOURCE_OPTIONS = {
    scheduler: 'async',
    steps: 1000,
    stepLimit: 1000,
    executionMethod: 'auto',
    variant: 'default',
    originalMaxExecTime: 1000,
    useSubst: false,
    isPrelude: false,
    throwInfiniteLoops: true
};
let previousCode = '';
let isPreviousCodeTimeoutError = false;
function runConcurrent(code, program, context, options) {
    if (previousCode === code) {
        context.nativeStorage.maxExecTime *= constants_1.JSSLANG_PROPERTIES.factorToIncreaseBy;
    }
    else {
        context.nativeStorage.maxExecTime = options.originalMaxExecTime;
    }
    context.previousCode.unshift(code);
    previousCode = code;
    try {
        return Promise.resolve({
            status: 'finished',
            context,
            value: (0, svml_machine_1.runWithProgram)((0, svml_compiler_1.compileForConcurrent)(program, context), context)
        });
    }
    catch (error) {
        if (error instanceof runtimeSourceError_1.RuntimeSourceError || error instanceof errors_1.ExceptionError) {
            context.errors.push(error); // use ExceptionErrors for non Source Errors
            return utils_1.resolvedErrorPromise;
        }
        context.errors.push(new errors_1.ExceptionError(error, constants_1.UNKNOWN_LOCATION));
        return utils_1.resolvedErrorPromise;
    }
}
function runSubstitution(program, context, options) {
    const steps = (0, stepper_1.getEvaluationSteps)(program, context, options.stepLimit);
    const redexedSteps = [];
    for (const step of steps) {
        const redex = (0, stepper_1.getRedex)(step[0], step[1]);
        const redexed = (0, stepper_1.redexify)(step[0], step[1]);
        redexedSteps.push({
            code: redexed[0],
            redex: redexed[1],
            explanation: step[2],
            function: (0, stepper_1.callee)(redex)
        });
    }
    return Promise.resolve({
        status: 'finished',
        context,
        value: redexedSteps
    });
}
function runInterpreter(program, context, options) {
    let it = (0, interpreter_1.evaluate)(program, context);
    let scheduler;
    if (context.variant === 'non-det') {
        it = (0, interpreter_non_det_1.nonDetEvaluate)(program, context);
        scheduler = new schedulers_1.NonDetScheduler();
    }
    else if (options.scheduler === 'async') {
        scheduler = new schedulers_1.AsyncScheduler();
    }
    else {
        scheduler = new schedulers_1.PreemptiveScheduler(options.steps);
    }
    return scheduler.run(it, context);
}
function runNative(code, program, context, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (previousCode === code && isPreviousCodeTimeoutError) {
            context.nativeStorage.maxExecTime *= constants_1.JSSLANG_PROPERTIES.factorToIncreaseBy;
        }
        else if (!options.isPrelude) {
            context.nativeStorage.maxExecTime = options.originalMaxExecTime;
        }
        if (!options.isPrelude) {
            context.previousCode.unshift(code);
            previousCode = code;
        }
        let transpiled;
        let sourceMapJson;
        try {
            (0, utils_1.appendModulesToContext)(program, context);
            switch (context.variant) {
                case 'gpu':
                    (0, gpu_1.transpileToGPU)(program);
                    break;
                case 'lazy':
                    (0, lazy_1.transpileToLazy)(program);
                    break;
            }
            ;
            ({ transpiled, sourceMapJson } = (0, transpiler_1.transpile)(program, context));
            let value = yield (0, evalContainer_1.sandboxedEval)(transpiled, context.nativeStorage, options, context.moduleContexts);
            if (context.variant === 'lazy') {
                value = (0, operators_1.forceIt)(value);
            }
            if (!options.isPrelude) {
                isPreviousCodeTimeoutError = false;
            }
            return Promise.resolve({
                status: 'finished',
                context,
                value
            });
        }
        catch (error) {
            const isDefaultVariant = options.variant === undefined || options.variant === 'default';
            if (isDefaultVariant && (0, errors_2.isPotentialInfiniteLoop)(error)) {
                const detectedInfiniteLoop = (0, runtime_1.testForInfiniteLoop)(code, context.previousCode.slice(1));
                if (detectedInfiniteLoop !== undefined) {
                    if (options.throwInfiniteLoops) {
                        context.errors.push(detectedInfiniteLoop);
                        return utils_1.resolvedErrorPromise;
                    }
                    else {
                        error.infiniteLoopError = detectedInfiniteLoop;
                        if (error instanceof errors_1.ExceptionError) {
                            ;
                            error.error.infiniteLoopError = detectedInfiniteLoop;
                        }
                    }
                }
            }
            if (error instanceof runtimeSourceError_1.RuntimeSourceError) {
                context.errors.push(error);
                if (error instanceof timeoutErrors_1.TimeoutError) {
                    isPreviousCodeTimeoutError = true;
                }
                return utils_1.resolvedErrorPromise;
            }
            if (error instanceof errors_1.ExceptionError) {
                // if we know the location of the error, just throw it
                if (error.location.start.line !== -1) {
                    context.errors.push(error);
                    return utils_1.resolvedErrorPromise;
                }
                else {
                    error = error.error; // else we try to get the location from source map
                }
            }
            const sourceError = yield (0, errors_3.toSourceError)(error, sourceMapJson);
            context.errors.push(sourceError);
            return utils_1.resolvedErrorPromise;
        }
    });
}
function sourceRunner(code, context, verboseErrors, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const theOptions = Object.assign(Object.assign({}, DEFAULT_SOURCE_OPTIONS), options);
        context.variant = (0, utils_1.determineVariant)(context, options);
        context.errors = [];
        // Parse and validate
        const program = (0, parser_1.parse)(code, context);
        if (!program) {
            return utils_1.resolvedErrorPromise;
        }
        (0, validator_1.validateAndAnnotate)(program, context);
        context.unTypecheckedCode.push(code);
        if (context.errors.length > 0) {
            return utils_1.resolvedErrorPromise;
        }
        (0, transpiler_1.hoistImportDeclarations)(program);
        if (context.variant === 'concurrent') {
            return runConcurrent(code, program, context, theOptions);
        }
        if (theOptions.useSubst) {
            return runSubstitution(program, context, theOptions);
        }
        const isNativeRunnable = (0, _1.determineExecutionMethod)(theOptions, context, program, verboseErrors);
        // Handle preludes
        if (context.prelude !== null) {
            const prelude = context.prelude;
            context.prelude = null;
            yield sourceRunner(prelude, context, verboseErrors, Object.assign(Object.assign({}, options), { isPrelude: true }));
            return sourceRunner(code, context, verboseErrors, options);
        }
        if (isNativeRunnable) {
            return runNative(code, program, context, theOptions);
        }
        return runInterpreter(program, context, theOptions);
    });
}
exports.sourceRunner = sourceRunner;
//# sourceMappingURL=sourceRunner.js.map