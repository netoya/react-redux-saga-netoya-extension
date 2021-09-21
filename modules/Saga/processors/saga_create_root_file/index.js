const fs = require("fs");
const ejs = require("ejs");

async function processCreateRootFile(path) {
  if (await fs.existsSync(path)) {
    return;
  }

  ejs.fileLoader = (filePath) => {
    let template = fs.readFileSync(__dirname + "/views/" + filePath);
    return template;
  };

  let sagaRootSagaFile = await ejs.renderFile(
    "saga_root_saga_file.ejs",
    {},
    { async: true }
  );

  await fs.writeFileSync(path, sagaRootSagaFile);
}

exports.processCreateRootFile = processCreateRootFile;
