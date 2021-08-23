const vscode = require("vscode");
const fs = require("fs");
const { camelCase } = require("text-case");

module.exports = async (PROJECT_PATH) => ({
  // Path
  async getPath() {
    let modulesPath = "/src/modules";

    let modulesExists = await fs.existsSync(PROJECT_PATH + modulesPath);
    if (!modulesExists) {
      vscode.window.showInformationMessage(
        "You don't have a modules folder in this project. Ex.: ./src/modules"
      );
      return;
    }

    return modulesPath;
  },
  async createHandlersFolder(module) {
    let modulePath = await this.getModulePath(module);

    let handlersPath = modulePath + "/handlers";

    if (await fs.existsSync(PROJECT_PATH + handlersPath)) {
      return handlersPath;
    }

    await fs.mkdirSync(PROJECT_PATH + handlersPath);

    return handlersPath;
  },
  // Module Path
  async getModulePath(module) {
    let modulesPath = await this.getPath(PROJECT_PATH);
    let modulePath = modulesPath + "/" + module;
    return modulePath;
  },
  // Choice
  async choice() {
    let modulesPath = await this.getPath(PROJECT_PATH);
    if (!modulesPath) {
      return;
    }

    let modules = await fs.readdirSync(PROJECT_PATH + modulesPath);
    if (modules.length < 1) {
      vscode.window.showInformationMessage("You don't have modules to choice.");
      return;
    }

    modules = modules.map((module) => {
      return { label: module };
    });

    let module = await vscode.window.showQuickPick(modules, {
      title: "Elegir un modulo",
    });

    if (!module) {
      return;
    }

    module = module.label;

    return module;
  },
});
