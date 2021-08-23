const vscode = require("vscode");
const fs = require("fs");

const ejs = require("ejs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;

const ModulesSource = require("../Modules/ModulesSource");
const { pascalCase, camelCase } = require("text-case");
const { processConstant } = require("./ConstantProccessConstant");

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
      let constantsFile = "constants.js";
      let constantsFilePath = modulePath + "/handlers/" + constantsFile;

      return constantsFilePath;
    },

    async exists(show_modal = false) {
      let constantsFilePath = await this.getPath();

      let constantsFileExists = await fs.existsSync(
        PROJECT_PATH + constantsFilePath
      );
      if (!constantsFileExists && show_modal) {
        vscode.window.showInformationMessage(
          "The module *" +
            module +
            "* don't have a constants file. *" +
            constantsFilePath +
            "*"
        );
        return;
      }
    },
    // Create file
    async createConstantFile() {
      let constantsFilePath = await this.getPath();
      if (await this.exists()) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(PROJECT_PATH + constantsFilePath)
        );

        return constantsFilePath;
      }

      await moduleSource.createHandlersFolder(module);

      let constantsConstantsPage = await ejs.renderFile(
        "constant_constant_file.ejs",
        { module: camelCase(module), moduleCapitalize: pascalCase(module) },
        { async: true }
      );

      await fs.writeFileSync(
        PROJECT_PATH + constantsFilePath,
        constantsConstantsPage
      );

      return constantsFilePath;
    },
    // addConstant
    async addConstant(name) {
      if (!this.exists(true)) {
        return;
      }

      let constantFilePath = await this.getPath();

      let data = await fs
        .readFileSync(PROJECT_PATH + constantFilePath)
        .toString();

      // Code to AST
      const parsedCode = babelParser.parse(data, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
      });

      // Process
      processConstant(parsedCode, module, name);

      // AST to code
      const code = generate(parsedCode, {
        retainLines: false,
        concise: false,

        // retainFunctionParens: true,
      });

      await fs.writeFileSync(PROJECT_PATH + constantFilePath, code.code);
    },
  };
};
