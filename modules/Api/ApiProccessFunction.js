const ASTQ = require("astq");
const { upperCase, snakeCase, camelCase } = require("text-case");
const {
  parseImport,
  parseObject,
  parseNode,
  parseNodes,
} = require("../parseFunctions");

const processApi = (ast, module, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
        // VariableDeclarator [
          /:id Identifier [
            @name == '${camelCase(module)}Api'
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
      async getList(params = {}){
        try {
          let response = await fetch(\`/url\`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              Accept: 'application/json',
              'access-token': token,
            },
            
            body: JSON.stringify({
              ...params,
            }),
          });


          if (!response.ok) {
            let error = await response.json();
            throw error;
          }

          let data = await response.json();
          return data;
        } catch (error) {
          throw error.response ? error.response.data : error;
        }
    
      },
    }`
  );

  let properties = functionBody.properties;

  Object.assign(properties, [...properties, ...newObject.properties]);

  properties.sort((a, b) => a.key.name.localeCompare(b.key.name));
};

const processFunction = (ast, module, name) => {
  processApi(ast, module, name);
};

exports.processFunction = processFunction;
