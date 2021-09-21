const { camelCase } = require("text-case");
const { astRender } = require("../../../../lib/ast_engine/ast_engine");
const {
  parseFile,
  get,
  parseCode,
  saveFile,
} = require("../../../../lib/ast_engine/types");

const render = function* ({ path, module_name }) {
  // Read Files
  let ast = yield parseFile(path);

  /**
   * Import
   */
  let check_import = yield get(
    ast,
    `ImportDeclaration StringLiteral[value='../modules/${camelCase(
      module_name
    )}/handlers/${camelCase(module_name)}Saga']`
  );

  if (check_import.length < 1) {
    let astCode = yield parseCode(
      `import ${camelCase(module_name)}Saga from '../modules/${camelCase(
        module_name
      )}/handlers/${camelCase(module_name)}Saga'`
    );

    let newImport = yield get(astCode, `ImportDeclaration`, "[0]");
    ast.program.body.splice(1, 0, newImport);
  }

  /**
   * all
   */

  let array_functions = yield get(
    ast,
    `CallExpression:has(Identifier[name='all'])>ArrayExpression`,
    "[0]"
  );

  const astElements = yield parseCode(`[${camelCase(module_name)}Saga()]`);
  const newArray = yield get(astElements, "ArrayExpression", "[0]");

  array_functions.elements.splice(0, 0, ...newArray.elements);
  array_functions.elements.sort((a, b) =>
    a.callee.name.localeCompare(b.callee.name)
  );

  /**
   * Save
   */
  yield saveFile(path, ast);
};

const processConnectRootSaga = (path, module_name) => {
  let script = render({
    path,
    module_name,
  });

  astRender(script);
};

exports.processConnectRootSaga = processConnectRootSaga;
