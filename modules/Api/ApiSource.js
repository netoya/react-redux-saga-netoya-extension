const vscode = require("vscode");
const fs = require("fs");

const ejs = require("ejs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;

const ModulesSource = require("../Modules/ModulesSource");
const { pascalCase, camelCase } = require("text-case");
const { processFunction } = require("./ApiProccessFunction");

module.exports = async (PROJECT_PATH, module) => {
  let moduleSource = null;
  let modulePath = null;

  if (!!module) {
    moduleSource = await ModulesSource(PROJECT_PATH);
    modulePath = await moduleSource.getModulePath(module);
  }

  ejs.fileLoader = (filePath) => {
    let template = fs.readFileSync(__dirname + "/views/" + filePath);
    return template;
  };

  return {
    // getPath
    async getPath() {
      let apiFile = camelCase(module) + "Api.js";
      let apiFilePath = modulePath + "/handlers/" + apiFile;

      return apiFilePath;
    },

    async exists(show_modal = false) {
      let apiFilePath = await this.getPath();

      let apiFileExists = await fs.existsSync(PROJECT_PATH + apiFilePath);
      if (!apiFileExists && show_modal) {
        vscode.window.showInformationMessage(
          "The module *" +
            module +
            "* don't have a api file. *" +
            apiFilePath +
            "*"
        );
        return;
      }
    },
    // Create file
    async createApiFile() {
      let apiFilePath = await this.getPath();
      if (await this.exists()) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(PROJECT_PATH + apiFilePath)
        );

        return apiFilePath;
      }

      await moduleSource.createHandlersFolder(module);

      let apiApiPage = await ejs.renderFile(
        "api_api_file.ejs",
        { module: camelCase(module), moduleCapitalize: pascalCase(module) },
        { async: true }
      );

      await fs.writeFileSync(PROJECT_PATH + apiFilePath, apiApiPage);

      return apiFilePath;
    },
    // addApiFunction
    async addApiFunction(name, url) {
      if (!this.exists(true)) {
        return;
      }

      let apiFilePath = await this.getPath();

      let data = await fs.readFileSync(PROJECT_PATH + apiFilePath).toString();

      // Code to AST
      const parsedCode = babelParser.parse(data, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
      });

      // Process
      processFunction(parsedCode, module, name, url);

      // AST to code
      const code = generate(parsedCode, {
        retainLines: false,
        concise: false,

        // retainFunctionParens: true,
      });

      await fs.writeFileSync(PROJECT_PATH + apiFilePath, code.code);
    },
  };
};
