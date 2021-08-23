const vscode = require("vscode");
const ModulesSource = require("../Modules/ModulesSource");
const ProjectSource = require("../Project/ProjectSource");
const PagesSource = require("./PagesSource");

const createPageFile = async (PROJECT_PATH, module) => {
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
      title: "Nombre de la pagina",
    });

    if (!name) {
      return;
    }

    //
    let pagesSource = await PagesSource(PROJECT_PATH, module);

    let pageFilePath = await pagesSource.createPageFile(name);

    if (!pageFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + pageFilePath)
    );

    return pageFilePath;
  } catch (error) {
    console.log(error);
  }
};

exports.createPageFile = createPageFile;
