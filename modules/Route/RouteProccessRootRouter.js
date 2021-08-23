const ASTQ = require("astq");
const { camelCase, pascalCase } = require("text-case");
const {
  parseImport,
  parseElement,
  stringifyCode,
} = require("../parseFunctions");

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
    )}Routes'
        ]
      ]`
  );

  // Buscamos en el array agregar este codigo
  const newImport = parseImport(
    `import {${pascalCase(name)}Routes } from '../modules/${camelCase(
      name
    )}/handlers/${camelCase(name)}Routes'`
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
    `<${pascalCase(name)}Routes path={\`${path}\`} ></${pascalCase(
      name
    )}Routes>`
  );

  let SwitchComponent = result[0];
  SwitchComponent.children.splice(0, 0, newNode);

  let lasted_children = [];
  SwitchComponent.children = SwitchComponent.children.filter((a) => {
    let a_path = a?.openingElement?.attributes?.find(
      (a) => a?.name?.name == "path"
    )?.value;

    a_path = (stringifyCode(a_path) || "{`/`}").replaceAll('"', "`");

    console.log({ a_path });
    if (a_path === "{`/`}") {
      lasted_children.push(a);
    }

    return a_path !== "{`/`}";
  });
  SwitchComponent.children.splice(
    SwitchComponent.children.length,
    0,
    ...lasted_children
  );
};

const processRootRouter = (ast, name, path) => {
  processConstants(ast, name);
  processSwitch(ast, name, path);
};

exports.processRootRouter = processRootRouter;
