const fs = require("fs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;
const ASTQ = require("astq");
const { parseElement } = require("../../parseFunctions");

const run = async () => {
  let data = await fs.readFileSync(__dirname + "/routes_base.js").toString();

  // Transformame de codigo a un array
  const parsedCode = babelParser.parse(data, {
    // parse in strict mode and allow module declarations
    sourceType: "module",

    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  // Busco el lugar donde meter
  let elem_export = parsedCode.program;

  let astq = new ASTQ();
  astq.adapter("mozast");

  let result = astq.query(
    elem_export,
    `
  // JSXElement [
    /:openingElement JSXOpeningElement [
      /:name JSXIdentifier [
        @name == 'Switch'
      ]
    ]
  ]`
  );

  let elem_switch = result[0];

  // Buscamos en el array agregar este codigo
  const RouteCode = parseElement(
    "<Route path={`/`} componet={componentPage}></Route>"
  );

  elem_switch.children.unshift(RouteCode);

  // Volveme del array a un codigo
  const code = generate(parsedCode, {
    retainLines: true,
    concise: true,
    // retainFunctionParens: true,
  });
  console.log(code.code);
};

run();
