const ASTQ = require("astq");
const { upperCase, snakeCase, camelCase } = require("text-case");
const { parseImport, parseObject, parseNode } = require("../../parseFunctions");

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
    )}Saga'
        ]
      ]`
  );

  // Buscamos en el array agregar este codigo
  const newImport = parseImport(
    `import ${camelCase(name)}Saga from '../modules/${camelCase(
      name
    )}/handlers/${camelCase(name)}Saga'`
  );

  if (result.length < 1) {
    ast.program.body.splice(1, 0, newImport);
    return;
  }
};

const processAll = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
        // CallExpression [
          / Identifier [
              @name == 'all'
          ]
        ]`
  );

  if (result.length < 1) {
    return;
  }

  const newObject = parseNode(`[${camelCase(name)}Saga()]`);

  let elements = result[0].arguments[0].elements;

  elements.splice(0, 0, ...newObject.expression.elements);

  elements.sort((a, b) => a.callee.name.localeCompare(b.callee.name));
  // Object.assign(properties, sorted);
};

const processRootSaga = (ast, name) => {
  processConstants(ast, name);
  processAll(ast, name);
};

exports.processRootSaga = processRootSaga;
