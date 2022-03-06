import Closure from '../interpreter/closure';
import { Context, Environment, Frame, Variant } from '../types';
export declare function mockContext(chapter?: number, variant?: Variant): Context;
export declare function mockRuntimeContext(): Context;
export declare function mockClosure(): Closure;
export declare function mockEnvironment(context: Context, name?: string, head?: Frame): Environment;
