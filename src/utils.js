import * as t from 'babel-types';

export const isGlobalizeExpression = node => (
  t.isCallExpression(node) &&
  t.isMemberExpression(node.callee) &&
  t.isIdentifier(node.callee.object) &&
  node.callee.object.name === 'Globalize'
);

export const getCallIdentifer = (node) => {
  return node.callee.property.name;
}

export const isGlobalizeMethodCall = (node, identifierName) => {
  return (
    isGlobalizeExpression(node) &&
    t.isIdentifier(node.callee.property) &&
    getCallIdentifer(node) === identifierName
  )
}

export const buildExpression = (name, args) => {
  return t.CallExpression(
    t.MemberExpression(
      t.Identifier('Globalize'),
      t.Identifier(name)
    ),
    args
  )
}
