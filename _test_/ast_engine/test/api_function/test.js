const { camelCase } = require("text-case");
const { run } = require("../../ast_engine");
const { parseFile, get, saveFile } = require("../../types");

const api_function = function* ({ project, module, name, url }) {
  // Read Files
  let ast = yield parseFile(__dirname + "/templates/test_base.js");
  let ast_function = yield parseFile(__dirname + "/templates/test_function.js");

  // Search Elements
  let functions = yield get(
    ast_function,
    "ObjectExpression",
    "[0].properties[0]"
  );
  let properties = yield get(ast, "ObjectExpression", "[0].properties");

  // Modify Data
  let Identifier = yield get(
    functions,
    "ObjectMethod>Identifier[name='_api_name_']",
    "[0]"
  );
  Identifier.name = camelCase(name + "");

  let url_path = yield get(
    functions,
    "CallExpression[callee.name='fetch']>TemplateLiteral>TemplateElement",
    "[0].value"
  );

  url_path.raw = `${url}`;

  properties.push(functions);

  // Save File
  yield saveFile(__dirname + "/output.js", ast);
};

let script = api_function({
  project: 1323,
  module: 12312,
  name: 34234,
  url: 534534,
});

run(script);
