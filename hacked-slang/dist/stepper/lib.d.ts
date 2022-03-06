import * as es from 'estree';
import { substituterNodes } from '../types';
export declare function get_time(): es.Literal;
export declare function display(val: substituterNodes): substituterNodes;
export declare function stringify(val: substituterNodes): es.Literal;
export declare function error(val: substituterNodes, str?: substituterNodes): void;
export declare function prompt(str: substituterNodes): es.Literal;
export declare function is_number(val: substituterNodes): es.Literal;
export declare function is_string(val: substituterNodes): es.Literal;
export declare function is_function(val: substituterNodes): es.Literal;
export declare function is_boolean(val: substituterNodes): es.Literal;
export declare function is_undefined(val: substituterNodes): es.Literal;
export declare function parse_int(str: substituterNodes, radix: substituterNodes): es.Expression;
export declare function evaluateMath(mathFn: string, ...args: substituterNodes[]): es.Expression;
export declare function pair(left: substituterNodes, right: substituterNodes): es.ArrayExpression;
export declare function is_pair(val: substituterNodes): es.Literal;
export declare function head(xs: substituterNodes): es.Expression;
export declare function tail(xs: substituterNodes): es.Expression;
export declare function is_null(val: substituterNodes): es.Literal;
export declare function list(...values: substituterNodes[]): es.ArrayExpression;
export declare function draw_data(...xs: substituterNodes[]): substituterNodes;
