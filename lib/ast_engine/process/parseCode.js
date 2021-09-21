const babelParser = require("@babel/parser");
const fs = require("fs");

exports.processParseCode = async (data) => {
  const code = babelParser.parse(data.code, {
    sourceType: "module",
    plugins: [
      // enable jsx and flow syntax
      "jsx",
      "flow",
    ],
  });

  return code;
};
