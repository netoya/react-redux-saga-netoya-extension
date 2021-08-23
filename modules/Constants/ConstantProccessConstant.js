const ASTQ = require("astq");
const { upperCase, snakeCase, camelCase, lowerCase } = require("text-case");
const { parseImport, parseObject, parseNode } = require("../parseFunctions");

const processExportConst = (ast, module, name) => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
      // ImportDeclaration [
        /:source StringLiteral [
            @value == '@${lowerCase(snakeCase(module))}/${upperCase(
      snakeCase(name)
    )}'
        ]
      ]`
  );

  // Buscamos en el array agregar este codigo
  const newImport = parseImport(
    `export const ${upperCase(snakeCase(name))} = '@${lowerCase(
      snakeCase(module)
    )}/${upperCase(snakeCase(name))}';`
  );

  if (result.length < 1) {
    ast.program.body.splice(1, 0, newImport);
    return;
  }
};

const processConstant = (ast, module, name) => {
  processExportConst(ast, module, name);
};

exports.processConstant = processConstant;
