const ASTQ = require("astq");
const { upperCase, snakeCase, camelCase } = require("text-case");
const { parseImport, parseObject } = require("../parseFunctions");

const processConstants = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
      // ImportDeclaration [
        /:source StringLiteral [
            @value == '../modules/${camelCase(name)}/handlers/${camelCase(
      name
    )}Reducer'
        ]
      ]`
  );

  // Buscamos en el array agregar este codigo
  const newImport = parseImport(
    `import {${camelCase(name)}Reducer } from '../modules/${camelCase(
      name
    )}/handlers/${camelCase(name)}Reducer'`
  );

  if (result.length < 1) {
    ast.program.body.splice(2, 0, newImport);
    return;
  }
};

const processCombineReducers = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
        // CallExpression [
          / Identifier [
              @name == 'combineReducers'
          ]
        ]`
  );

  if (result.length < 1) {
    return;
  }

  const newObject = parseObject(`{
      ${camelCase(name)}: ${camelCase(name)}Reducer,
    }`);

  let properties = result[0].arguments[0].properties;

  properties.splice(0, 0, ...newObject.properties);

  properties.sort((a, b) => a.key.name.localeCompare(b.key.name));
  // Object.assign(properties, sorted);
};

const processRootReducer = (ast, name) => {
  processConstants(ast, name);
  processCombineReducers(ast, name);
};

exports.processRootReducer = processRootReducer;
