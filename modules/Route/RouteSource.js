const vscode = require("vscode");
const fs = require("fs");
const readline = require("readline");
const ejs = require("ejs");

const insertLine = require("insert-line");
const ModulesSource = require("../Modules/ModulesSource");
const { pascalCase, camelCase } = require("text-case");
const ProjectSource = require("../Project/ProjectSource");
const { processRootRouter } = require("./RouteProccessRootRouter");

const babelParser = require("@babel/parser");
const generate = require("@babel/generator").default;

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
    createRootRoutes: async () => {
      ejs.fileLoader = (filePath) => {
        let template = fs.readFileSync(__dirname + "/views/" + filePath);
        return template;
      };

      let projectSource = await ProjectSource(PROJECT_PATH);
      let rootsPath = await projectSource.createRootsFolder(PROJECT_PATH);

      let rootRoutesFilePath = rootsPath + "/rootRoutes.js";

      if (!(await fs.existsSync(PROJECT_PATH + rootRoutesFilePath))) {
        let routeRootRoutesFile = await ejs.renderFile(
          "route_root_routes_file.ejs",
          {},
          { async: true }
        );

        await fs.writeFileSync(
          PROJECT_PATH + rootRoutesFilePath,
          routeRootRoutesFile
        );
      }

      return rootRoutesFilePath;
    },
    // getPath
    async getPath() {
      let routeFile = camelCase(module) + "Routes.js";
      let routeFilePath = modulePath + "/handlers/" + routeFile;

      return routeFilePath;
    },

    async exists(show_modal = false) {
      let routeFilePath = await this.getPath();

      let routeFileExists = await fs.existsSync(PROJECT_PATH + routeFilePath);
      if (!routeFileExists && show_modal) {
        vscode.window.showInformationMessage(
          "The module *" +
            module +
            "* don't have a route file. *" +
            routeFilePath +
            "*"
        );
        return;
      }
    },
    // Create file
    async createRouteFile() {
      let routeFilePath = await this.getPath();
      if (await this.exists()) {
        await vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(PROJECT_PATH + routeFilePath)
        );

        return routeFilePath;
      }

      await moduleSource.createHandlersFolder(module);

      let routeRoutePage = await ejs.renderFile(
        "route_route_file.ejs",
        { module, moduleCapitalize: pascalCase(module) },
        { async: true }
      );

      await fs.writeFileSync(PROJECT_PATH + routeFilePath, routeRoutePage);

      return routeFilePath;
    },
    // addRoute
    async addRoute(componentPage, path) {
      if (!this.exists(true)) {
        return;
      }

      let routeFilePath = await this.getPath();
      const fileStream = fs.createReadStream(PROJECT_PATH + routeFilePath);

      let rl = readline.Interface({
        input: fileStream,
      });

      let SwitchStart = false;
      let SwitchEndLine = -1;
      let count = 1;
      let prevSpace = 0;
      let spaces = 0;
      let alreadyImported = false;
      for await (const line of rl) {
        if (
          !alreadyImported &&
          line.includes("import") &&
          line.includes(componentPage)
        ) {
          alreadyImported = true;
        }

        if (line.includes("<Switch")) {
          SwitchStart = true;
          spaces = line.length - line.trimStart().length;
          spaces = spaces - prevSpace;
          spaces = prevSpace + spaces + spaces;
        }

        if (SwitchStart) {
          line.includes(">");

          SwitchEndLine = count;
          break;
        }

        prevSpace = line.length - line.trimStart().length;
        count += 1;
      }

      if (SwitchEndLine < 0) {
        vscode.window.showInformationMessage(
          "Don't found a <Switch> component in the route file."
        );
        return;
      }

      if (!alreadyImported) {
        let routeImportPage = await ejs.renderFile(
          "route_import_page.ejs",
          { componentPage },
          { async: true }
        );

        insertLine(PROJECT_PATH + routeFilePath)
          .contentSync(routeImportPage)
          .at(3);
        SwitchEndLine += 1;
      }

      let routeRoutePage = await ejs.renderFile(
        "route_route_page.ejs",
        { spaces: "".padStart(spaces, " "), componentPage, path },
        { async: true }
      );

      insertLine(PROJECT_PATH + routeFilePath)
        .contentSync(routeRoutePage)
        .at(SwitchEndLine + 1);

      console.log({ SwitchStart, SwitchEndLine, count });
    },

    // rootRouteConnect
    async rootRouteConnect(path) {
      let rootRouteFilePath = await this.createRootRoutes();
      if (!rootRouteFilePath) {
        return;
      }

      let data = await fs
        .readFileSync(PROJECT_PATH + rootRouteFilePath)
        .toString();

      // Code to AST
      const parsedCode = babelParser.parse(data, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
      });

      // Process
      processRootRouter(parsedCode, module, path);

      // AST to code
      const code = generate(parsedCode, {
        retainLines: false,
        concise: false,

        // retainFunctionParens: true,
      });

      await fs.writeFileSync(PROJECT_PATH + rootRouteFilePath, code.code);

      return rootRouteFilePath;
    },
  };
};
