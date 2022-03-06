import { Context, CustomBuiltIns, Environment, Value, Variant } from './types';
export declare class LazyBuiltIn {
    func: (...arg0: any) => any;
    evaluateArgs: boolean;
    constructor(func: (...arg0: any) => any, evaluateArgs: boolean);
}
export declare class EnvTree {
    private _root;
    private map;
    get root(): EnvTreeNode | null;
    insert(environment: Environment): void;
    getTreeNode(environment: Environment): EnvTreeNode | undefined;
}
export declare class EnvTreeNode {
    readonly environment: Environment;
    parent: EnvTreeNode | null;
    private _children;
    constructor(environment: Environment, parent: EnvTreeNode | null);
    get children(): EnvTreeNode[];
    resetChildren(newChildren: EnvTreeNode[]): void;
    private clearChildren;
    private addChildren;
    addChild(newChild: EnvTreeNode): EnvTreeNode;
}
export declare const createGlobalEnvironment: () => Environment;
export declare const createEmptyContext: <T>(chapter: number, variant: Variant | undefined, externalSymbols: string[], externalContext?: T | undefined, moduleParams?: any) => Context<T>;
export declare const ensureGlobalEnvironmentExist: (context: Context) => void;
export declare const defineSymbol: (context: Context, name: string, value: Value) => void;
export declare function defineBuiltin(context: Context, name: `${string}${'=' | '...'}${string}`, // enforce minArgsNeeded
value: Value, minArgsNeeded: number): void;
export declare function defineBuiltin(context: Context, name: string, value: Value, minArgsNeeded?: number): void;
export declare const importExternalSymbols: (context: Context, externalSymbols: string[]) => void;
/**
 * Imports builtins from standard and external libraries.
 */
export declare const importBuiltins: (context: Context, externalBuiltIns: CustomBuiltIns) => void;
declare const createContext: <T>(chapter?: number, variant?: Variant, externalSymbols?: string[], externalContext?: T | undefined, externalBuiltIns?: CustomBuiltIns, moduleParams?: any) => Context;
export default createContext;
