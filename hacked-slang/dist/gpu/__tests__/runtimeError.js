"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:only-arrow-functions */
const rttc_1 = require("../../utils/rttc");
const lib_1 = require("../lib");
test('__createKernel with uninitialized array throws error', () => {
    const bounds = [5, 4];
    const extern = {};
    const f1 = function () {
        return this.thread.y * this.thread.x;
    };
    const arr = [];
    const f2 = function (i, j) {
        return i * j;
    };
    const f = () => (0, lib_1.__createKernel)(bounds, extern, f1, arr, f2);
    expect(f).toThrow(rttc_1.TypeError);
});
test('__createKernel with 2 loops + uninitialized array throws error', () => {
    const bounds = [5, 4, 3];
    const extern = {};
    const f1 = function () {
        return this.thread.z * this.thread.y * this.thread.x;
    };
    const arr = [];
    for (let i = 0; i < 5; i = i + 1) {
        arr[i] = [];
    }
    const f2 = function (i, j, k) {
        return i * j * k;
    };
    const f = () => (0, lib_1.__createKernel)(bounds, extern, f1, arr, f2);
    expect(f).toThrow(rttc_1.TypeError);
});
//# sourceMappingURL=runtimeError.js.map