import * as es from 'estree';
import { Context, TypeAnnotatedNode } from '../types';
export declare function validateAndAnnotate(program: es.Program, context: Context): TypeAnnotatedNode<es.Program>;
