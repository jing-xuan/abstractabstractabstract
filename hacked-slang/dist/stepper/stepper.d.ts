import * as es from 'estree';
import { Context, substituterNodes } from '../types';
export declare const codify: (node: substituterNodes) => string;
export declare const redexify: (node: substituterNodes, path: string[][]) => [string, string];
export declare const getRedex: (node: substituterNodes, path: string[][]) => substituterNodes;
export declare function getEvaluationSteps(program: es.Program, context: Context, stepLimit: number | undefined): [es.Program, string[][], string][];
export interface IStepperPropContents {
    code: string;
    redex: string;
    explanation: string;
    function: es.Expression | undefined | es.Super;
}
export declare function isStepperOutput(output: any): output is IStepperPropContents;
export declare function callee(content: substituterNodes): es.Expression | undefined | es.Super;
