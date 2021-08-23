const ASTQ = require("astq");
const { upperCase, snakeCase, camelCase, pascalCase } = require("text-case");
const {
  parseImport,
  parseObject,
  parseNode,
  parseElement,
  stringifyCode,
} = require("../../parseFunctions");

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
    )}Routers'
        ]
      ]`
  );

  // Buscamos en el array agregar este codigo
  const newImport = parseImport(
    `import {${pascalCase(name)}Routers } from '../modules/${camelCase(
      name
    )}/handlers/${camelCase(name)}Routers'`
  );

  if (result.length < 1) {
    ast.program.body.splice(2, 0, newImport);
    return;
  }
};

const processSwitch = (ast, name, path = "/") => {
  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    ast,
    `
        // JSXElement [
          // JSXIdentifier[
            @name == 'Switch'
          ] 
        ]`
  );
  if (result.length < 1) {
    return;
  }

  const newNode = parseElement(
    `<${pascalCase(name)}Routers path={\`${path}\`} ></${pascalCase(
      name
    )}Routers>`
  );

  let SwitchComponent = result[0];
  SwitchComponent.children.splice(0, 0, newNode);

  SwitchComponent.children.sort((a, b) => {
    let a_path = a?.openingElement?.attributes?.find(
      (a) => a?.name?.name == "path"
    )?.value;
    let b_path = b?.openingElement?.attributes?.find(
      (a) => a?.name?.name == "path"
    )?.value;

    a_path = stringifyCode(a_path) || "{``}";
    b_path = stringifyCode(b_path) || "{``}";

    return b_path === "{``}" || b_path === "{`/`}"
      ? b_path.localeCompare(a_path)
      : a_path.localeCompare(b_path);
  });
};

const processRootRouter = (ast, name, path) => {
  processConstants(ast, name);
  processSwitch(ast, name, path);
};

exports.processRootRouter = processRootRouter;
