"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-classes-per-file */
const astring_1 = require("astring");
const astCreator_1 = require("../utils/astCreator");
const interpreter_1 = require("./interpreter");
const closureToJS = (value, context, klass) => {
    function DummyClass() {
        const args = Array.prototype.slice.call(arguments);
        const gen = (0, interpreter_1.apply)(context, value, args, (0, astCreator_1.callExpression)((0, astCreator_1.identifier)(klass), args), this);
        let it = gen.next();
        while (!it.done) {
            it = gen.next();
        }
        return it.value;
    }
    Object.defineProperty(DummyClass, 'name', {
        value: klass
    });
    Object.setPrototypeOf(DummyClass, () => undefined);
    Object.defineProperty(DummyClass, 'Inherits', {
        value: (Parent) => {
            DummyClass.prototype = Object.create(Parent.prototype);
            DummyClass.prototype.constructor = DummyClass;
        }
    });
    DummyClass.toString = () => (0, astring_1.generate)(value.originalNode);
    DummyClass.call = (thisArg, ...args) => {
        return DummyClass.apply(thisArg, args);
    };
    return DummyClass;
};
class Callable extends Function {
    constructor(f) {
        super();
        return Object.setPrototypeOf(f, new.target.prototype);
    }
}
/**
 * Models function value in the interpreter environment.
 */
class Closure extends Callable {
    constructor(node, environment, context) {
        super(function (...args) {
            return funJS.apply(this, args);
        });
        this.node = node;
        this.environment = environment;
        this.originalNode = node;
        if (this.node.type === 'FunctionDeclaration' && this.node.id !== null) {
            this.functionName = this.node.id.name;
        }
        else {
            this.functionName =
                (this.node.params.length === 1 ? '' : '(') +
                    this.node.params.map((o) => o.name).join(', ') +
                    (this.node.params.length === 1 ? '' : ')') +
                    ' => ...';
        }
        // TODO: Investigate how relevant this really is.
        // .fun seems to only be used in interpreter's NewExpression handler, which uses .fun.prototype.
        const funJS = closureToJS(this, context, this.functionName);
        this.fun = funJS;
    }
    static makeFromArrowFunction(node, environment, context) {
        function isExpressionBody(body) {
            return body.type !== 'BlockStatement';
        }
        const functionBody = isExpressionBody(node.body)
            ? [(0, astCreator_1.returnStatement)(node.body, node.body.loc)]
            : node.body;
        const closure = new Closure((0, astCreator_1.blockArrowFunction)(node.params, functionBody, node.loc), environment, context);
        // Set the closure's node to point back at the original one
        closure.originalNode = node;
        return closure;
    }
    toString() {
        return (0, astring_1.generate)(this.originalNode);
    }
}
exports.default = Closure;
//# sourceMappingURL=closure.js.map