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
      let pagesPath = modulePath + "/pages";

      return pagesPath;
    },

    async exists() {
      let pagesPath = await this.getPath();
      let pagesExists = await fs.existsSync(PROJECT_PATH + pagesPath);
      if (!pagesExists) {
        vscode.window.showInformationMessage(
          "The module *" +
            module +
            "* don't have a pages folder. *" +
            pagesPath +
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

      let pagesPath = await this.getPath();

      let pages = await fs.readdirSync(PROJECT_PATH + pagesPath);
      if (pages.length < 1) {
        vscode.window.showInformationMessage("You don't have pages to choice.");
        return;
      }

      pages = pages.map((page) => {
        return { label: page.split(".").shift() };
      });

      let page = await vscode.window.showQuickPick(pages);

      if (!page) {
        return;
      }

      page = page.label;

      return page;
    },
    // Create pages folder
    async createPagesFolder() {
      let pagesPath = modulePath + "/pages";

      if (await fs.existsSync(PROJECT_PATH + pagesPath)) {
        return pagesPath;
      }

      await fs.mkdirSync(PROJECT_PATH + pagesPath);

      return pagesPath;
    },
    // Create file
    async createPageFile(name) {
      let pagesPath = await this.getPath();
      let pageFilePath = pagesPath + "/" + pascalCase(name) + "Page.js";

      if (await fs.existsSync(PROJECT_PATH + pageFilePath)) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(PROJECT_PATH + pageFilePath)
        );

        return pageFilePath;
      }

      await this.createPagesFolder(module);

      let pagePageFile = await ejs.renderFile(
        "page_page_file.ejs",
        { name: pascalCase(name) },
        { async: true }
      );

      await fs.writeFileSync(PROJECT_PATH + pageFilePath, pagePageFile);

      return pageFilePath;
    },
  };
};
