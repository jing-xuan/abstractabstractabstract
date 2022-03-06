import { ModuleContext } from '..';
import { NativeStorage } from '../types';
declare type Evaler = (code: string, nativeStorage: NativeStorage, moduleParams: any, moduleContexts: Map<string, ModuleContext>) => any;
export declare const sandboxedEval: Evaler;
export {};
