const fs = require("fs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;
const { processList } = require("./ReducerProccessList");

// GOALS
// * add constants
// * add initialState
// * add function
// * add case to switch

const run = async () => {
  let data = await fs.readFileSync(__dirname + "/reducer_base.js").toString();

  const parsedCode = babelParser.parse(data, {
    sourceType: "module",
    plugins: ["jsx", "flow"],
  });

  // Procesamos los datos
  processList(parsedCode, "cajeros");
  processList(parsedCode, "bancos");
  processList(parsedCode, "zanahorias");

  // Volveme del array a un codigo
  const code = generate(parsedCode, {
    retainLines: false,
    concise: false,

    // retainFunctionParens: true,
  });

  await fs.writeFileSync(__dirname + "/output.js", code.code);
};

run();
