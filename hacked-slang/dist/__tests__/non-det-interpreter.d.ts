export declare function testDeterministicCode(code: string, expectedValue: any, hasError?: boolean): Promise<void>;
export declare function testNonDeterministicCode(code: string, expectedValues: any[], hasError?: boolean, random?: boolean): Promise<void>;
