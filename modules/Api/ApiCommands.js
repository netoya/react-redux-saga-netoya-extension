const vscode = require("vscode");
const ModulesSource = require("../Modules/ModulesSource");
const ProjectSource = require("../Project/ProjectSource");
const ApiSource = require("./ApiSource");

const createApiFile = async (PROJECT_PATH, module) => {
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

    let apiSource = await ApiSource(PROJECT_PATH, module);

    let apiFilePath = await apiSource.createApiFile();

    if (!apiFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + apiFilePath)
    );

    return apiFilePath;
  } catch (error) {
    console.log(error);
  }
};

const addApiFunction = async (PROJECT_PATH, module) => {
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
      title: "Nombre de la funcion",
    });

    if (!name) {
      return;
    }

    // URL
    let url = await vscode.window.showInputBox({
      value: "${url}/",
      title: "URL",
    });

    if (!url) {
      return;
    }

    let apiSource = await ApiSource(PROJECT_PATH, module);
    await apiSource.addApiFunction(name, url);

    let apiFilePath = await apiSource.getPath();

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + apiFilePath)
    );

    return apiFilePath;
  } catch (error) {
    console.log(error);
  }
};

exports.addApiFunction = addApiFunction;
exports.createApiFile = createApiFile;
