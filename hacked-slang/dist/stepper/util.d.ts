import * as es from 'estree';
import { BlockExpression, substituterNodes } from '../types';
export declare function isBuiltinFunction(node: substituterNodes): boolean;
export declare function isInfinity(node: substituterNodes): boolean;
export declare function isPositiveNumber(node: substituterNodes): boolean;
export declare function isNegNumber(node: substituterNodes): boolean;
export declare function isNumber(node: substituterNodes): boolean;
export declare function isAllowedLiterals(node: substituterNodes): boolean;
export declare function getDeclaredNames(node: es.BlockStatement | BlockExpression | es.Program): Set<string>;
