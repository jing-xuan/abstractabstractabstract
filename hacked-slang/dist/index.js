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
exports.assemble = exports.setBreakpointAtLine = exports.createContext = exports.compile = exports.interrupt = exports.resume = exports.runInContext = exports.getTypeInformation = exports.getNames = exports.hasDeclaration = exports.getAllOccurrencesInScope = exports.getScope = exports.findDeclaration = exports.parseError = exports.SourceDocumentation = void 0;
const source_map_1 = require("source-map");
const createContext_1 = require("./createContext");
exports.createContext = createContext_1.default;
const errors_1 = require("./errors/errors");
const finder_1 = require("./finder");
const parser_1 = require("./parser/parser");
const scope_refactoring_1 = require("./scope-refactoring");
const inspector_1 = require("./stdlib/inspector");
Object.defineProperty(exports, "setBreakpointAtLine", { enumerable: true, get: function () { return inspector_1.setBreakpointAtLine; } });
const walkers_1 = require("./utils/walkers");
const svml_assembler_1 = require("./vm/svml-assembler");
Object.defineProperty(exports, "assemble", { enumerable: true, get: function () { return svml_assembler_1.assemble; } });
const svml_compiler_1 = require("./vm/svml-compiler");
var docTooltip_1 = require("./editors/ace/docTooltip");
Object.defineProperty(exports, "SourceDocumentation", { enumerable: true, get: function () { return docTooltip_1.SourceDocumentation; } });
const name_extractor_1 = require("./name-extractor");
const runner_1 = require("./runner");
const typeChecker_1 = require("./typeChecker/typeChecker");
const stringify_1 = require("./utils/stringify");
// needed to work on browsers
if (typeof window !== 'undefined') {
    // @ts-ignore
    source_map_1.SourceMapConsumer.initialize({
        'lib/mappings.wasm': 'https://unpkg.com/source-map@0.7.3/lib/mappings.wasm'
    });
}
let verboseErrors = false;
function parseError(errors, verbose = verboseErrors) {
    const errorMessagesArr = errors.map(error => {
        const line = error.location ? error.location.start.line : '<unknown>';
        const column = error.location ? error.location.start.column : '<unknown>';
        const explanation = error.explain();
        if (verbose) {
            // TODO currently elaboration is just tagged on to a new line after the error message itself. find a better
            // way to display it.
            const elaboration = error.elaborate();
            return line < 1
                ? explanation
                : `Line ${line}, Column ${column}: ${explanation}\n${elaboration}\n`;
        }
        else {
            return line < 1 ? explanation : `Line ${line}: ${explanation}`;
        }
    });
    return errorMessagesArr.join('\n');
}
exports.parseError = parseError;
function findDeclaration(code, context, loc) {
    const program = (0, parser_1.looseParse)(code, context);
    if (!program) {
        return null;
    }
    const identifierNode = (0, finder_1.findIdentifierNode)(program, context, loc);
    if (!identifierNode) {
        return null;
    }
    const declarationNode = (0, finder_1.findDeclarationNode)(program, identifierNode);
    if (!declarationNode || identifierNode === declarationNode) {
        return null;
    }
    return declarationNode.loc;
}
exports.findDeclaration = findDeclaration;
function getScope(code, context, loc) {
    const program = (0, parser_1.looseParse)(code, context);
    if (!program) {
        return [];
    }
    const identifierNode = (0, finder_1.findIdentifierNode)(program, context, loc);
    if (!identifierNode) {
        return [];
    }
    const declarationNode = (0, finder_1.findDeclarationNode)(program, identifierNode);
    if (!declarationNode || declarationNode.loc == null || identifierNode !== declarationNode) {
        return [];
    }
    return (0, scope_refactoring_1.getScopeHelper)(declarationNode.loc, program, identifierNode.name);
}
exports.getScope = getScope;
function getAllOccurrencesInScope(code, context, loc) {
    const program = (0, parser_1.looseParse)(code, context);
    if (!program) {
        return [];
    }
    const identifierNode = (0, finder_1.findIdentifierNode)(program, context, loc);
    if (!identifierNode) {
        return [];
    }
    const declarationNode = (0, finder_1.findDeclarationNode)(program, identifierNode);
    if (declarationNode == null || declarationNode.loc == null) {
        return [];
    }
    return (0, scope_refactoring_1.getAllOccurrencesInScopeHelper)(declarationNode.loc, program, identifierNode.name);
}
exports.getAllOccurrencesInScope = getAllOccurrencesInScope;
function hasDeclaration(code, context, loc) {
    const program = (0, parser_1.looseParse)(code, context);
    if (!program) {
        return false;
    }
    const identifierNode = (0, finder_1.findIdentifierNode)(program, context, loc);
    if (!identifierNode) {
        return false;
    }
    const declarationNode = (0, finder_1.findDeclarationNode)(program, identifierNode);
    if (declarationNode == null || declarationNode.loc == null) {
        return false;
    }
    return true;
}
exports.hasDeclaration = hasDeclaration;
function getNames(code, line, col, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const [program, comments] = (0, parser_1.parseForNames)(code);
        if (!program) {
            return [];
        }
        const cursorLoc = { line, column: col };
        const [progNames, displaySuggestions] = (0, name_extractor_1.getProgramNames)(program, comments, cursorLoc);
        const keywords = (0, name_extractor_1.getKeywords)(program, cursorLoc, context);
        return [progNames.concat(keywords), displaySuggestions];
    });
}
exports.getNames = getNames;
function getTypeInformation(code, context, loc, name) {
    try {
        // parse the program into typed nodes and parse error
        const program = (0, parser_1.typedParse)(code, context);
        if (program === null) {
            return '';
        }
        if (context.prelude !== null) {
            (0, typeChecker_1.typeCheck)((0, parser_1.typedParse)(context.prelude, context), context);
        }
        const [typedProgram, error] = (0, typeChecker_1.typeCheck)(program, context);
        const parsedError = parseError(error);
        if (context.prelude !== null) {
            // the env of the prelude was added, we now need to remove it
            context.typeEnvironment.pop();
        }
        // initialize the ans string
        let ans = '';
        if (parsedError) {
            ans += parsedError + '\n';
        }
        if (!typedProgram) {
            return ans;
        }
        // get name of the node
        const getName = (typedNode) => {
            var _a;
            let nodeId = '';
            if (typedNode.type) {
                if (typedNode.type === 'FunctionDeclaration') {
                    nodeId = (_a = typedNode.id) === null || _a === void 0 ? void 0 : _a.name;
                }
                else if (typedNode.type === 'VariableDeclaration') {
                    nodeId = typedNode.declarations[0].id.name;
                }
                else if (typedNode.type === 'Identifier') {
                    nodeId = typedNode.name;
                }
            }
            return nodeId;
        };
        // callback function for findNodeAt function
        function findByLocationPredicate(t, nd) {
            if (!nd.inferredType) {
                return false;
            }
            const isInLoc = (nodeLoc) => {
                return !(nodeLoc.start.line > loc.line ||
                    nodeLoc.end.line < loc.line ||
                    (nodeLoc.start.line === loc.line && nodeLoc.start.column > loc.column) ||
                    (nodeLoc.end.line === loc.line && nodeLoc.end.column < loc.column));
            };
            const location = nd.loc;
            if (nd.type && location) {
                return getName(nd) === name && isInLoc(location);
            }
            return false;
        }
        // report both as the type inference
        const res = (0, walkers_1.findNodeAt)(typedProgram, undefined, undefined, findByLocationPredicate);
        if (res === undefined) {
            return ans;
        }
        const node = res.node;
        if (node === undefined) {
            return ans;
        }
        const actualNode = node.type === 'VariableDeclaration'
            ? node.declarations[0].init
            : node;
        const type = (0, stringify_1.typeToString)(actualNode.type === 'FunctionDeclaration'
            ? actualNode.functionInferredType
            : actualNode.inferredType);
        return ans + `At Line ${loc.line} => ${getName(node)}: ${type}`;
    }
    catch (error) {
        return '';
    }
}
exports.getTypeInformation = getTypeInformation;
function runInContext(code, context, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, runner_1.isFullJSChapter)(context.chapter)) {
            return (0, runner_1.fullJSRunner)(code, context, options);
        }
        verboseErrors = (0, runner_1.hasVerboseErrors)(code);
        return (0, runner_1.sourceRunner)(code, context, verboseErrors, options);
    });
}
exports.runInContext = runInContext;
function resume(result) {
    if (result.status === 'finished' || result.status === 'error') {
        return result;
    }
    else {
        return result.scheduler.run(result.it, result.context);
    }
}
exports.resume = resume;
function interrupt(context) {
    const globalEnvironment = context.runtime.environments[context.runtime.environments.length - 1];
    context.runtime.environments = [globalEnvironment];
    context.runtime.isRunning = false;
    context.errors.push(new errors_1.InterruptedError(context.runtime.nodes[0]));
}
exports.interrupt = interrupt;
function compile(code, context, vmInternalFunctions) {
    const astProgram = (0, parser_1.parse)(code, context);
    if (!astProgram) {
        return undefined;
    }
    try {
        return (0, svml_compiler_1.compileToIns)(astProgram, undefined, vmInternalFunctions);
    }
    catch (error) {
        context.errors.push(error);
        return undefined;
    }
}
exports.compile = compile;
//# sourceMappingURL=index.js.map