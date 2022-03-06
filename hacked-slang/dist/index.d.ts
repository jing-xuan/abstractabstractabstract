import { SourceLocation } from 'estree';
import createContext from './createContext';
import { setBreakpointAtLine } from './stdlib/inspector';
import { Context, Error as ResultError, ExecutionMethod, Finished, ModuleContext, ModuleState, Result, SourceError, SVMProgram, Variant } from './types';
import { assemble } from './vm/svml-assembler';
export { SourceDocumentation } from './editors/ace/docTooltip';
export interface IOptions {
    scheduler: 'preemptive' | 'async';
    steps: number;
    stepLimit: number;
    executionMethod: ExecutionMethod;
    variant: Variant;
    originalMaxExecTime: number;
    useSubst: boolean;
    isPrelude: boolean;
    throwInfiniteLoops: boolean;
}
export declare function parseError(errors: SourceError[], verbose?: boolean): string;
export declare function findDeclaration(code: string, context: Context, loc: {
    line: number;
    column: number;
}): SourceLocation | null | undefined;
export declare function getScope(code: string, context: Context, loc: {
    line: number;
    column: number;
}): SourceLocation[];
export declare function getAllOccurrencesInScope(code: string, context: Context, loc: {
    line: number;
    column: number;
}): SourceLocation[];
export declare function hasDeclaration(code: string, context: Context, loc: {
    line: number;
    column: number;
}): boolean;
export declare function getNames(code: string, line: number, col: number, context: Context): Promise<any>;
export declare function getTypeInformation(code: string, context: Context, loc: {
    line: number;
    column: number;
}, name: string): string;
export declare function runInContext(code: string, context: Context, options?: Partial<IOptions>): Promise<Result>;
export declare function resume(result: Result): Finished | ResultError | Promise<Result>;
export declare function interrupt(context: Context): void;
export declare function compile(code: string, context: Context, vmInternalFunctions?: string[]): SVMProgram | undefined;
export { createContext, Context, ModuleContext, ModuleState, Result, setBreakpointAtLine, assemble };
