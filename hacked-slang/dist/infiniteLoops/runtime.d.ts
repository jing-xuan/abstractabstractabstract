import { InfiniteLoopError } from './errors';
/**
 * Tests the given program for infinite loops.
 * @param code Program to test.
 * @param previousCodeStack Any code previously entered in the REPL.
 * @returns SourceError if an infinite loop was detected, undefined otherwise.
 */
export declare function testForInfiniteLoop(code: string, previousCodeStack: string[]): InfiniteLoopError | undefined;
