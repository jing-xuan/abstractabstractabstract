import * as es from 'estree';
import { Context } from '../';
export interface NameDeclaration {
    name: string;
    meta: string;
    score?: number;
}
export declare function getKeywords(prog: es.Node, cursorLoc: es.Position, context: Context): NameDeclaration[];
export declare function getProgramNames(prog: es.Node, comments: acorn.Comment[], cursorLoc: es.Position): [NameDeclaration[], boolean];
