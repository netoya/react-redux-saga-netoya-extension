const { processGet } = require("./process/get");
const { processParseCode } = require("./process/parseCode");
const { processParseFile } = require("./process/parseFile");
const { processSaveFile } = require("./process/saveFile");

async function astRender(script) {
  let data = script.next();
  while (data) {
    let result = await processData(data.value);
    if (data.done) break;
    data = script.next(result);
  }

  return data;
}

async function processData(data) {
  console.log("proccessData =>", typeof data);
  if (typeof data !== "object") {
    return data;
  }

  switch (data.type) {
    case "parseFile":
      return await processParseFile(data.payload);
    case "parseCode":
      return await processParseCode(data.payload);
    case "saveFile":
      return await processSaveFile(data.payload);
    case "get":
      return await processGet(data.payload);
  }
  return;
}

module.exports = {
  astRender,
};
