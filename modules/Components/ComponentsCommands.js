const vscode = require("vscode");
const ModulesSource = require("../Modules/ModulesSource");
const ProjectSource = require("../Project/ProjectSource");
const ComponentsSource = require("./ComponentsSource");

const createComponentFile = async (PROJECT_PATH, module) => {
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
      title: "Nombre del component",
    });

    if (!name) {
      return;
    }

    //
    let componentsSource = await ComponentsSource(PROJECT_PATH, module);

    let componentFilePath = await componentsSource.createComponentFile(name);

    if (!componentFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + componentFilePath)
    );

    return componentFilePath;
  } catch (error) {
    console.log(error);
  }
};

exports.createComponentFile = createComponentFile;
