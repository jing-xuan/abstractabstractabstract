"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeSourceError = void 0;
const constants_1 = require("../constants");
const types_1 = require("../types");
class RuntimeSourceError {
    constructor(node) {
        this.type = types_1.ErrorType.RUNTIME;
        this.severity = types_1.ErrorSeverity.ERROR;
        this.location = node ? node.loc : constants_1.UNKNOWN_LOCATION;
    }
    explain() {
        return '';
    }
    elaborate() {
        return this.explain();
    }
}
exports.RuntimeSourceError = RuntimeSourceError;
//# sourceMappingURL=runtimeSourceError.js.map