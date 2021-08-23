const ASTQ = require("astq");
const { upperCase, snakeCase, camelCase } = require("text-case");
const {
  parseImport,
  parseObject,
  parseNode,
  parseNodes,
} = require("../../parseFunctions");

const processApi = (ast, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
        // VariableDeclarator [
          /:id Identifier [
            @name == 'productosApi'
          ]
          && /:init ArrowFunctionExpression
        ]`
  );

  if (result.length < 1) {
    return;
  }

  let functionBody = result[0].init.body;

  // Buscamos en el array agregar este codigo
  const newObject = parseObject(
    `{
      async getList(){
        console.log("list");
      },
      async getOne(){
        console.log("one");
      }
    }`
  );

  let properties = functionBody.properties;

  Object.assign(properties, [...properties, ...newObject.properties]);

  properties.sort((a, b) => a.key.name.localeCompare(b.key.name));
};

const processFunction = (ast, name) => {
  processApi(ast, name);
};

exports.processFunction = processFunction;
