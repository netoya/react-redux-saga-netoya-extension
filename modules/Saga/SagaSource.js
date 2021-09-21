const vscode = require("vscode");
const fs = require("fs");

const ejs = require("ejs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;

const ModulesSource = require("../Modules/ModulesSource");
const { pascalCase, camelCase } = require("text-case");
const ProjectSource = require("../Project/ProjectSource");
const {
  processConnectRootSaga,
} = require("./processors/saga_connect_root_saga");
const { processCreateRootFile } = require("./processors/saga_create_root_file");
const {
  processCreateModuleFile,
} = require("./processors/saga_create_module_file");

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

      processCreateRootFile(PROJECT_PATH + rootSagaFilePath);

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

      //
      processCreateModuleFile(PROJECT_PATH + sagaFilePath, module);

      return sagaFilePath;
    },
    // rootSagaConnect
    async rootSagaConnect() {
      let rootSagaFilePath = await this.createRootSaga();
      if (!rootSagaFilePath) {
        return;
      }

      // Process
      processConnectRootSaga(PROJECT_PATH + rootSagaFilePath, module);

      return rootSagaFilePath;
    },
  };
};
