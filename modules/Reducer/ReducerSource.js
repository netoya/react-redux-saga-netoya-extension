const vscode = require("vscode");
const fs = require("fs");

const ejs = require("ejs");
const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;

const ModulesSource = require("../Modules/ModulesSource");
const { pascalCase, camelCase } = require("text-case");
const { processList } = require("./processors/reducer_list");
const ProjectSource = require("../Project/ProjectSource");
const { processRootReducer } = require("./ReducerProccessRootReducer");

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
    createRootReducer: async () => {
      ejs.fileLoader = (filePath) => {
        let template = fs.readFileSync(__dirname + "/views/" + filePath);
        return template;
      };

      let projectSource = await ProjectSource(PROJECT_PATH);
      let rootsPath = await projectSource.createRootsFolder(PROJECT_PATH);

      let rootReducerFilePath = rootsPath + "/rootReducer.js";

      if (!(await fs.existsSync(PROJECT_PATH + rootReducerFilePath))) {
        let reducerRootReducerFile = await ejs.renderFile(
          "reducer_root_reducer_file.ejs",
          {},
          { async: true }
        );

        await fs.writeFileSync(
          PROJECT_PATH + rootReducerFilePath,
          reducerRootReducerFile
        );
      }

      return rootReducerFilePath;
    },
    // getPath
    async getPath() {
      let reducerFile = camelCase(module) + "Reducer.js";
      let reducerFilePath = modulePath + "/handlers/" + reducerFile;

      return reducerFilePath;
    },

    async exists(show_modal = false) {
      let reducerFilePath = await this.getPath();

      let reducerFileExists = await fs.existsSync(
        PROJECT_PATH + reducerFilePath
      );
      if (!reducerFileExists && show_modal) {
        vscode.window.showInformationMessage(
          "The module *" +
            module +
            "* don't have a reducer file. *" +
            reducerFilePath +
            "*"
        );
        return;
      }
    },
    // Create file
    async createReducerFile() {
      let reducerFilePath = await this.getPath();
      if (await this.exists()) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(PROJECT_PATH + reducerFilePath)
        );

        return reducerFilePath;
      }

      await moduleSource.createHandlersFolder(module);

      let reducerReducerPage = await ejs.renderFile(
        "reducer_reducer_file.ejs",
        { module: camelCase(module), moduleCapitalize: pascalCase(module) },
        { async: true }
      );

      await fs.writeFileSync(
        PROJECT_PATH + reducerFilePath,
        reducerReducerPage
      );

      return reducerFilePath;
    },
    // addReducerList
    async addReducerList(name) {
      if (!this.exists(true)) {
        return;
      }

      let reducerFilePath = await this.getPath();

      let data = await fs
        .readFileSync(PROJECT_PATH + reducerFilePath)
        .toString();

      // Code to AST
      const parsedCode = babelParser.parse(data, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
      });

      // Process
      processList(parsedCode, name);

      // AST to code
      const code = generate(parsedCode, {
        retainLines: false,
        concise: false,

        // retainFunctionParens: true,
      });

      await fs.writeFileSync(PROJECT_PATH + reducerFilePath, code.code);
    },
    // rootReducerConnect
    async rootReducerConnect() {
      let rootReducerFilePath = await this.createRootReducer();
      if (!rootReducerFilePath) {
        return;
      }

      let data = await fs
        .readFileSync(PROJECT_PATH + rootReducerFilePath)
        .toString();

      // Code to AST
      const parsedCode = babelParser.parse(data, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
      });

      // Process
      processRootReducer(parsedCode, module);

      // AST to code
      const code = generate(parsedCode, {
        retainLines: false,
        concise: false,

        // retainFunctionParens: true,
      });

      await fs.writeFileSync(PROJECT_PATH + rootReducerFilePath, code.code);

      return rootReducerFilePath;
    },
  };
};
