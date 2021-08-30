const generate = require("@babel/generator").default;
const fs = require("fs");

exports.processSaveFile = async (data) => {
  const code = generate(data.ast, {
    retainLines: false,
    concise: false,

    // retainFunctionParens: true,
  });

  await fs.writeFileSync(data.filename, code.code);
};
