const vscode = require("vscode");
const fs = require("fs");

const ejs = require("ejs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;

const ModulesSource = require("../Modules/ModulesSource");
const { pascalCase, camelCase } = require("text-case");
const ProjectSource = require("../Project/ProjectSource");
const { processRootSaga } = require("./SagaProccessRootSaga");

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
    createRootSaga: async () => {
      ejs.fileLoader = (filePath) => {
        let template = fs.readFileSync(__dirname + "/views/" + filePath);
        return template;
      };

      let projectSource = await ProjectSource(PROJECT_PATH);
      let rootsPath = await projectSource.createRootsFolder(PROJECT_PATH);

      let rootSagaFilePath = rootsPath + "/rootSaga.js";

      if (!(await fs.existsSync(PROJECT_PATH + rootSagaFilePath))) {
        let sagaRootSagaFile = await ejs.renderFile(
          "saga_root_saga_file.ejs",
          {},
          { async: true }
        );

        await fs.writeFileSync(
          PROJECT_PATH + rootSagaFilePath,
          sagaRootSagaFile
        );
      }

      return rootSagaFilePath;
    },
    // getPath
    async getPath() {
      let sagaFile = camelCase(module) + "Saga.js";
      let sagaFilePath = modulePath + "/handlers/" + sagaFile;

      return sagaFilePath;
    },

    async exists(show_modal = false) {
      let sagaFilePath = await this.getPath();

      let sagaFileExists = await fs.existsSync(PROJECT_PATH + sagaFilePath);
      if (!sagaFileExists && show_modal) {
        vscode.window.showInformationMessage(
          "The module *" +
            module +
            "* don't have a saga file. *" +
            sagaFilePath +
            "*"
        );
        return;
      }
    },
    // Create file
    async createSagaFile() {
      let sagaFilePath = await this.getPath();
      if (await this.exists()) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(PROJECT_PATH + sagaFilePath)
        );

        return sagaFilePath;
      }

      await moduleSource.createHandlersFolder(module);

      let sagaSagaPage = await ejs.renderFile(
        "saga_saga_file.ejs",
        { module: camelCase(module), moduleCapitalize: pascalCase(module) },
        { async: true }
      );

      await fs.writeFileSync(PROJECT_PATH + sagaFilePath, sagaSagaPage);

      return sagaFilePath;
    },
    // rootSagaConnect
    async rootSagaConnect() {
      let rootSagaFilePath = await this.createRootSaga();
      if (!rootSagaFilePath) {
        return;
      }

      let data = await fs
        .readFileSync(PROJECT_PATH + rootSagaFilePath)
        .toString();

      // Code to AST
      const parsedCode = babelParser.parse(data, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
      });

      // Process
      processRootSaga(parsedCode, module);

      // AST to code
      const code = generate(parsedCode, {
        retainLines: false,
        concise: false,

        // retainFunctionParens: true,
      });

      await fs.writeFileSync(PROJECT_PATH + rootSagaFilePath, code.code);

      return rootSagaFilePath;
    },
  };
};
