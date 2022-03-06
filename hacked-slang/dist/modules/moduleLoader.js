"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModuleTabs = exports.convertRawTabToFunction = exports.loadModuleBundle = exports.memoizedGetModuleFile = exports.memoizedGetModuleManifest = exports.httpGet = exports.setModulesStaticURL = exports.MODULES_STATIC_URL = exports.newHttpRequest = void 0;
const lodash_1 = require("lodash");
const xmlhttprequest_ts_1 = require("xmlhttprequest-ts");
const moduleErrors_1 = require("../errors/moduleErrors");
// Supports both JSDom (Web Browser) environment and Node environment
const newHttpRequest = () => typeof window === 'undefined' ? new xmlhttprequest_ts_1.XMLHttpRequest() : new XMLHttpRequest();
exports.newHttpRequest = newHttpRequest;
// Default modules static url. Exported for testing.
exports.MODULES_STATIC_URL = 'https://source-academy.github.io/modules';
function setModulesStaticURL(url) {
    exports.MODULES_STATIC_URL = url;
}
exports.setModulesStaticURL = setModulesStaticURL;
/**
 * Send a HTTP Get request to the specified endpoint.
 * @return NodeXMLHttpRequest | XMLHttpRequest
 */
function httpGet(url) {
    const request = (0, exports.newHttpRequest)();
    try {
        // If running function in node environment, set request timeout
        if (typeof window === 'undefined')
            request.timeout = 10000;
        request.open('GET', url, false);
        request.send(null);
    }
    catch (error) {
        if (!(error instanceof DOMException))
            throw error;
    }
    if (request.status !== 200 && request.status !== 304)
        throw new moduleErrors_1.ModuleConnectionError();
    return request.responseText;
}
exports.httpGet = httpGet;
/**
 * Send a HTTP GET request to the modules endpoint to retrieve the manifest
 * @return Modules
 */
exports.memoizedGetModuleManifest = (0, lodash_1.memoize)(getModuleManifest);
function getModuleManifest() {
    const rawManifest = httpGet(`${exports.MODULES_STATIC_URL}/modules.json`);
    return JSON.parse(rawManifest);
}
/**
 * Send a HTTP GET request to the modules endpoint to retrieve the specified file
 * @return String of module file contents
 */
exports.memoizedGetModuleFile = (0, lodash_1.memoize)(getModuleFile);
function getModuleFile(name, type) {
    return httpGet(`${exports.MODULES_STATIC_URL}/${type}s/${name}.js`);
}
/**
 * Loads the respective module package (functions from the module)
 * @param path imported module name
 * @param context
 * @param node import declaration node
 * @returns the module's functions object
 */
function loadModuleBundle(path, context, node) {
    const modules = (0, exports.memoizedGetModuleManifest)();
    // Check if the module exists
    const moduleList = Object.keys(modules);
    if (moduleList.includes(path) === false)
        throw new moduleErrors_1.ModuleNotFoundError(path, node);
    // Get module file
    const moduleText = (0, exports.memoizedGetModuleFile)(path, 'bundle');
    try {
        const moduleBundle = eval(moduleText);
        return moduleBundle(context.moduleParams, context.moduleContexts);
    }
    catch (error) {
        throw new moduleErrors_1.ModuleInternalError(path, node);
    }
}
exports.loadModuleBundle = loadModuleBundle;
function convertRawTabToFunction(rawTabString) {
    rawTabString = rawTabString.trim();
    return rawTabString.substring(0, rawTabString.length - 9) + ')';
}
exports.convertRawTabToFunction = convertRawTabToFunction;
/**
 * Loads the module contents of a package
 *
 * @param path imported module name
 * @param node import declaration node
 * @returns an array of functions
 */
function loadModuleTabs(path, node) {
    const modules = (0, exports.memoizedGetModuleManifest)();
    // Check if the module exists
    const moduleList = Object.keys(modules);
    if (moduleList.includes(path) === false)
        throw new moduleErrors_1.ModuleNotFoundError(path, node);
    // Retrieves the tabs the module has from modules.json
    const sideContentTabPaths = modules[path].tabs;
    // Load the tabs for the current module
    return sideContentTabPaths.map(path => {
        const rawTabFile = (0, exports.memoizedGetModuleFile)(path, 'tab');
        try {
            return eval(convertRawTabToFunction(rawTabFile));
        }
        catch (error) {
            throw new moduleErrors_1.ModuleInternalError(path, node);
        }
    });
}
exports.loadModuleTabs = loadModuleTabs;
//# sourceMappingURL=moduleLoader.js.map