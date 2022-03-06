import { IOptions, Result } from '..';
import { Context } from '../types';
export declare function sourceRunner(code: string, context: Context, verboseErrors: boolean, options?: Partial<IOptions>): Promise<Result>;
