const fs = require("fs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;
const { processRootReducer } = require("./ReducerProccessRootReducer");

const run = async () => {
  let data = await fs.readFileSync(__dirname + "/reducer_base.js").toString();

  const parsedCode = babelParser.parse(data, {
    sourceType: "module",
    plugins: ["jsx", "flow"],
  });

  // Procesamos los datos
  processRootReducer(parsedCode, "home");

  // Volveme del array a un codigo
  const code = generate(parsedCode, {
    retainLines: false,
    concise: false,

    // retainFunctionParens: true,
  });

  await fs.writeFileSync(__dirname + "/output.js", code.code);
};

run();
