const { processGet } = require("./process/get");
const { processParseFile } = require("./process/parseFile");
const { processSaveFile } = require("./process/saveFile");

async function run(script) {
  let data = script.next();
  while (data) {
    let result = await processData(data.value);
    if (data.done) break;
    data = script.next(result);
  }
}

async function processData(data) {
  console.log("proccessData =>", typeof data);
  if (typeof data !== "object") {
    return data;
  }

  switch (data.type) {
    case "parseFile":
      return await processParseFile(data.payload);
    case "saveFile":
      return await processSaveFile(data.payload);
    case "get":
      return await processGet(data.payload);
  }
  return;
}

module.exports = {
  run,
};
// function run(function_gerator){
//     var generator = function_gerator();

//     let done = false
//     while(process_info = generator.next()){
//         if(process_info.done()) break;

//         let data = processData()
//     }
// }
