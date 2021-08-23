const fs = require("fs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;
const { processRootRouter } = require("./RouterProccessRootRoutes");

const run = async () => {
  let data = await fs.readFileSync(__dirname + "/router_base.js").toString();

  const parsedCode = babelParser.parse(data, {
    sourceType: "module",
    plugins: ["jsx", "flow"],
  });

  // Procesamos los datos
  processRootRouter(parsedCode, "coala", "/coala/animal");
  processRootRouter(parsedCode, "ardilla", "/");
  processRootRouter(parsedCode, "perro", "/animal/perro");

  // Volveme del array a un codigo
  const code = generate(parsedCode, {
    retainLines: false,
    concise: false,

    // retainFunctionParens: true,
  });

  await fs.writeFileSync(__dirname + "/output.js", code.code);
};

run();
