"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createContext_1 = require("../createContext");
const interpreter_1 = require("../interpreter/interpreter");
const context_1 = require("../mocks/context");
test('EnvTree root should be null upon instantiation', () => {
    const envTree = new createContext_1.EnvTree();
    expect(envTree.root).toBeNull();
});
test('EnvTree::insert should insert the globalEnvironment as the root', () => {
    const envTree = new createContext_1.EnvTree();
    envTree.insert((0, createContext_1.createGlobalEnvironment)());
    expect(envTree.root).toMatchSnapshot({
        environment: {
            id: expect.any(String)
        }
    });
});
test('EnvTree::getTreeNode should return the tree node that contains a pointer to the given environment', () => {
    var _a;
    const envTree = new createContext_1.EnvTree();
    const globalEnvironment = (0, createContext_1.createGlobalEnvironment)();
    envTree.insert(globalEnvironment);
    expect((_a = envTree.getTreeNode(globalEnvironment)) === null || _a === void 0 ? void 0 : _a.environment).toMatchSnapshot({
        id: expect.any(String)
    });
});
test('EnvTreeNode::resetChildren should reset the children of the node to the given children', () => {
    const context = (0, context_1.mockContext)(4);
    const parent = (0, context_1.mockEnvironment)(context, 'programEnvironment');
    (0, interpreter_1.pushEnvironment)(context, parent);
    // children under parent
    const child1 = (0, context_1.mockEnvironment)(context);
    const child2 = (0, context_1.mockEnvironment)(context);
    const child3 = (0, context_1.mockEnvironment)(context);
    (0, interpreter_1.pushEnvironment)(context, child1);
    (0, interpreter_1.pushEnvironment)(context, child2);
    (0, interpreter_1.pushEnvironment)(context, child3);
    // children under child3
    const grandChild1 = (0, context_1.mockEnvironment)(context);
    const grandChild2 = (0, context_1.mockEnvironment)(context);
    const grandChild3 = (0, context_1.mockEnvironment)(context);
    (0, interpreter_1.pushEnvironment)(context, grandChild1);
    (0, interpreter_1.pushEnvironment)(context, grandChild2);
    (0, interpreter_1.pushEnvironment)(context, grandChild3);
    const envTree = context.runtime.environmentTree;
    const parentNode = envTree.getTreeNode(parent);
    const grandChildNode1 = envTree.getTreeNode(grandChild1);
    const grandChildNode2 = envTree.getTreeNode(grandChild2);
    const grandChildNode3 = envTree.getTreeNode(grandChild3);
    expect(parentNode).not.toBeNull();
    expect(grandChildNode1).not.toBeNull();
    expect(grandChildNode2).not.toBeNull();
    expect(grandChildNode3).not.toBeNull();
    parentNode === null || parentNode === void 0 ? void 0 : parentNode.children.forEach(child => {
        expect(child).toMatchSnapshot({
            environment: {
                id: expect.any(String)
            }
        });
    });
    parentNode === null || parentNode === void 0 ? void 0 : parentNode.resetChildren([
        grandChildNode1,
        grandChildNode2,
        grandChildNode3
    ]);
    parentNode === null || parentNode === void 0 ? void 0 : parentNode.children.forEach(child => {
        expect(child).toMatchSnapshot({
            environment: {
                id: expect.any(String)
            }
        });
    });
});
test('EnvTreeNode::addChild should add the given child node to the tree node', () => {
    const context = (0, context_1.mockContext)(4);
    const programEnv = (0, context_1.mockEnvironment)(context, 'programEnvironment');
    const envTreeRoot = context.runtime.environmentTree.root;
    expect(envTreeRoot).not.toBeNull();
    envTreeRoot === null || envTreeRoot === void 0 ? void 0 : envTreeRoot.addChild(new createContext_1.EnvTreeNode(programEnv, envTreeRoot));
    envTreeRoot === null || envTreeRoot === void 0 ? void 0 : envTreeRoot.children.forEach(child => {
        expect(child).toMatchSnapshot({
            environment: {
                id: expect.any(String)
            }
        });
    });
});
//# sourceMappingURL=environmentTree.js.map