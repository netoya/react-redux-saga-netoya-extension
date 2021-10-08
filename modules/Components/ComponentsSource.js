const vscode = require("vscode");
const fs = require("fs");
const ejs = require("ejs");
const ModulesSource = require("../Modules/ModulesSource");
const { pascalCase } = require("text-case");

module.exports = async (PROJECT_PATH, module) => {
  let moduleSource = await ModulesSource(PROJECT_PATH);
  let modulePath = await moduleSource.getModulePath(module);

  ejs.fileLoader = (filePath) => {
    let template = fs.readFileSync(__dirname + "/views/" + filePath);
    return template;
  };

  return {
    async getPath() {
      let componentsPath = modulePath + "/components";

      return componentsPath;
    },

    async exists() {
      let componentsPath = await this.getPath();
      let componentsExists = await fs.existsSync(PROJECT_PATH + componentsPath);
      if (!componentsExists) {
        vscode.window.showInformationMessage(
          "The module *" +
            module +
            "* don't have a components folder. *" +
            componentsPath +
            "*"
        );
        return;
      }

      return true;
    },

    async choice() {
      if (!(await this.exists())) {
        return;
      }

      let componentsPath = await this.getPath();

      let components = await fs.readdirSync(PROJECT_PATH + componentsPath);
      if (components.length < 1) {
        vscode.window.showInformationMessage("You don't have components to choice.");
        return;
      }

      components = components.map((component) => {
        return { label: component.split(".").shift() };
      });

      let component = await vscode.window.showQuickPick(components);

      if (!component) {
        return;
      }

      component = component.label;

      return component;
    },
    // Create components folder
    async createComponentsFolder() {
      let componentsPath = modulePath + "/components";

      if (await fs.existsSync(PROJECT_PATH + componentsPath)) {
        return componentsPath;
      }

      await fs.mkdirSync(PROJECT_PATH + componentsPath);

      return componentsPath;
    },
    // Create file
    async createComponentFile(name) {
      let componentsPath = await this.getPath();
      let componentFilePath = componentsPath + "/" + pascalCase(name) + ".js";

      if (await fs.existsSync(PROJECT_PATH + componentFilePath)) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(PROJECT_PATH + componentFilePath)
        );

        return componentFilePath;
      }

      await this.createComponentsFolder(module);

      let componentComponentFile = await ejs.renderFile(
        "component_component_file.ejs",
        { name: pascalCase(name) },
        { async: true }
      );

      await fs.writeFileSync(PROJECT_PATH + componentFilePath, componentComponentFile);

      return componentFilePath;
    },
  };
};
