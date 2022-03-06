import { Program } from 'estree';
import { IOptions } from '..';
import { Context, Variant } from '../types';
export declare function isFullJSChapter(chapter: number): boolean;
/**
 * Small function to determine the variant to be used
 * by a program, as both context and options can have
 * a variant. The variant provided in options will
 * have precedence over the variant provided in context.
 *
 * @param context The context of the program.
 * @param options Options to be used when
 *                running the program.
 *
 * @returns The variant that the program is to be run in
 */
export declare function determineVariant(context: Context, options: Partial<IOptions>): Variant;
export declare function determineExecutionMethod(theOptions: IOptions, context: Context, program: Program, verboseErrors: boolean): boolean;
/**
 * Add UI tabs needed for modules to program context
 *
 * @param program AST of program to be ran
 * @param context The context of the program
 */
export declare function appendModulesToContext(program: Program, context: Context): void;
export declare function hasVerboseErrors(theCode: string): boolean;
export declare const resolvedErrorPromise: Promise<import("../types").Suspended | import("../types").SuspendedNonDet | import("../types").Finished | import("../types").Error>;
