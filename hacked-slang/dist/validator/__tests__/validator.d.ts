import * as es from 'estree';
import { TypeAnnotatedNode } from '../../types';
export declare function toValidatedAst(code: string): TypeAnnotatedNode<es.Program>;
