const babelParser = require("@babel/parser");
const fs = require("fs");

exports.processParseFile = async (data) => {
  let text = await fs.readFileSync(data.filename).toString();

  const code = babelParser.parse(text, {
    sourceType: "module",
    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  return code;
};
