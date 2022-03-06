import * as es from 'estree';
import { Context, Environment } from '../types';
declare class Callable extends Function {
    constructor(f: any);
}
/**
 * Models function value in the interpreter environment.
 */
export default class Closure extends Callable {
    node: es.Function;
    environment: Environment;
    static makeFromArrowFunction(node: es.ArrowFunctionExpression, environment: Environment, context: Context): Closure;
    /** Unique ID defined for anonymous closure */
    functionName: string;
    /** Fake closure function */
    fun: Function;
    /** The original node that created this Closure */
    originalNode: es.Function;
    constructor(node: es.Function, environment: Environment, context: Context);
    toString(): string;
}
export {};
