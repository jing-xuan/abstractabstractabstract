import { ModuleContext } from '../types';
export declare type Modules = {
    [module: string]: {
        tabs: string[];
    };
};
export declare type ModuleBundle = (params: any, context: Map<string, ModuleContext>) => ModuleFunctions;
export declare type ModuleFunctions = {
    [functionName: string]: Function;
};
