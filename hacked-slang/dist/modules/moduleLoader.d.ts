/// <reference types="lodash" />
import es from 'estree';
import { XMLHttpRequest as NodeXMLHttpRequest } from 'xmlhttprequest-ts';
import { Context } from '../types';
import { ModuleFunctions, Modules } from './moduleTypes';
export declare const newHttpRequest: () => XMLHttpRequest | NodeXMLHttpRequest;
export declare let MODULES_STATIC_URL: string;
export declare function setModulesStaticURL(url: string): void;
/**
 * Send a HTTP Get request to the specified endpoint.
 * @return NodeXMLHttpRequest | XMLHttpRequest
 */
export declare function httpGet(url: string): string;
/**
 * Send a HTTP GET request to the modules endpoint to retrieve the manifest
 * @return Modules
 */
export declare const memoizedGetModuleManifest: typeof getModuleManifest & import("lodash").MemoizedFunction;
declare function getModuleManifest(): Modules;
/**
 * Send a HTTP GET request to the modules endpoint to retrieve the specified file
 * @return String of module file contents
 */
export declare const memoizedGetModuleFile: typeof getModuleFile & import("lodash").MemoizedFunction;
declare function getModuleFile(name: string, type: 'tab' | 'bundle'): string;
/**
 * Loads the respective module package (functions from the module)
 * @param path imported module name
 * @param context
 * @param node import declaration node
 * @returns the module's functions object
 */
export declare function loadModuleBundle(path: string, context: Context, node?: es.Node): ModuleFunctions;
export declare function convertRawTabToFunction(rawTabString: string): string;
/**
 * Loads the module contents of a package
 *
 * @param path imported module name
 * @param node import declaration node
 * @returns an array of functions
 */
export declare function loadModuleTabs(path: string, node?: es.Node): any[];
export {};
