import * as es from 'estree';
import { Context, ForAll, SourceError, Type, TypeAnnotatedNode, TypeEnvironment, Variable } from '../types';
declare type Env = TypeEnvironment;
/**
 * An additional layer of typechecking to be done right after parsing.
 * @param program Parsed Program
 */
export declare function typeCheck(program: TypeAnnotatedNode<es.Program>, context: Context): [TypeAnnotatedNode<es.Program>, SourceError[]];
export declare function tVar(name: string | number): Variable;
export declare function tForAll(type: Type): ForAll;
export declare function createTypeEnvironment(chapter: number): Env;
export {};
