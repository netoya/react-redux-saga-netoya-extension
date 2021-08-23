const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;

const parseElement = (element) => {
  const code = babelParser.parse("<>" + element + "</>", {
    sourceType: "module",
    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  return code.program.body[0].expression.children[0];
};

const parseImport = (import_string) => {
  const code = babelParser.parse(import_string, {
    sourceType: "module",
    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  return code.program.body[0];
};

const parseNode = (node_string) => {
  const code = babelParser.parse(node_string, {
    sourceType: "module",
    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  return code.program.body[0];
};

const parseNodes = (node_string) => {
  const code = babelParser.parse(node_string, {
    sourceType: "module",
    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  return code.program.body;
};

const parseObject = (object_string) => {
  const code = babelParser.parse("var object = " + object_string, {
    sourceType: "module",
    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  return code.program.body[0].declarations[0].init;
};

exports.stringifyCode = (ast) => {
  const code = generate(ast, {
    retainLines: false,
    concise: false,

    // retainFunctionParens: true,
  });
  return code?.code;
};

exports.parseElement = parseElement;
exports.parseImport = parseImport;
exports.parseObject = parseObject;
exports.parseNode = parseNode;
exports.parseNodes = parseNodes;
