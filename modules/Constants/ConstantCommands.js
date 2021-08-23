const vscode = require("vscode");
const ModulesSource = require("../Modules/ModulesSource");
const ProjectSource = require("../Project/ProjectSource");
const ConstantSource = require("./ConstantSource");

const createConstantFile = async (PROJECT_PATH, module) => {
  try {
    // PROJECT
    if (!PROJECT_PATH) {
      let projectSource = ProjectSource();
      PROJECT_PATH = await projectSource.choice();
      if (!PROJECT_PATH) {
        return;
      }
    }

    // MODULES
    if (!module) {
      let moduleSource = await ModulesSource(PROJECT_PATH);
      module = await moduleSource.choice();

      if (!module) {
        return;
      }
    }

    let constantSource = await ConstantSource(PROJECT_PATH, module);

    let constantFilePath = await constantSource.createConstantFile();

    if (!constantFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + constantFilePath)
    );

    return constantFilePath;
  } catch (error) {
    console.log(error);
  }
};

const addConstant = async (PROJECT_PATH, module) => {
  try {
    // PROJECT
    if (!PROJECT_PATH) {
      let projectSource = ProjectSource();
      PROJECT_PATH = await projectSource.choice();
      if (!PROJECT_PATH) {
        return;
      }
    }

    // MODULES
    if (!module) {
      let moduleSource = await ModulesSource(PROJECT_PATH);
      module = await moduleSource.choice();

      if (!module) {
        return;
      }
    }

    // NAME
    let name = await vscode.window.showInputBox({
      value: "",
      title: "Nombre de la constante",
    });

    if (!name) {
      return;
    }

    let constantSource = await ConstantSource(PROJECT_PATH, module);
    await constantSource.addConstant(name);

    let constantFilePath = await constantSource.getPath();

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + constantFilePath)
    );

    return constantFilePath;
  } catch (error) {
    console.log(error);
  }
};

exports.addConstant = addConstant;
exports.createConstantFile = createConstantFile;
