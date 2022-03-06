import * as es from 'estree';
import { Context, substituterNodes } from '../types';
export declare function valueToExpression(value: any, context?: Context): es.Expression;
export declare function nodeToValue(node: substituterNodes): any;
