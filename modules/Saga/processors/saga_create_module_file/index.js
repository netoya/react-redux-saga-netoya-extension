const fs = require("fs");
const ejs = require("ejs");
const { pascalCase, camelCase } = require("text-case");

async function processCreateModuleFile(path, module) {
  if (await fs.existsSync(path)) {
    return;
  }

  ejs.fileLoader = (filePath) => {
    let template = fs.readFileSync(__dirname + "/views/" + filePath);
    return template;
  };

  let sagaSagaPage = await ejs.renderFile(
    "saga_saga_file.ejs",
    { module: camelCase(module), moduleCapitalize: pascalCase(module) },
    { async: true }
  );

  await fs.writeFileSync(path, sagaSagaPage);
}

exports.processCreateModuleFile = processCreateModuleFile;
