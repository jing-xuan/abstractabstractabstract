import { IOptions, Result } from '..';
import { Context } from '../types';
export declare function fullJSRunner(code: string, context: Context, options?: Partial<IOptions>): Promise<Result>;
