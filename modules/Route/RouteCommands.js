const vscode = require("vscode");
const ModulesSource = require("../Modules/ModulesSource");
const PagesSource = require("../Pages/PagesSource");
const ProjectSource = require("../Project/ProjectSource");
const RouteSource = require("./RouteSource");

const addRoute = async (PROJECT_PATH, module, page) => {
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

    // PAGES
    if (!page) {
      let pageSource = await PagesSource(PROJECT_PATH, module);
      page = await pageSource.choice();

      if (!page) {
        return;
      }
    }

    // PATH
    let path = await vscode.window.showInputBox({
      value: "/",
      valueSelection: [2, 2],
    });

    if (!path) {
      return;
    }

    let routeSource = await RouteSource(PROJECT_PATH, module);
    await routeSource.addRoute(page, path);

    let routeFilePath = await routeSource.getPath();

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + routeFilePath)
    );

    return routeFilePath;
  } catch (error) {
    console.log(error);
  }
};

const createRouteFile = async (PROJECT_PATH, module) => {
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

    let routeSource = await RouteSource(PROJECT_PATH, module);

    let routeFilePath = await routeSource.createRouteFile();

    if (!routeFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + routeFilePath)
    );

    return routeFilePath;
  } catch (error) {
    console.log(error);
  }
};

const createRootRoutesFile = async (PROJECT_PATH) => {
  try {
    // PROJECT
    if (!PROJECT_PATH) {
      let projectSource = ProjectSource();
      PROJECT_PATH = await projectSource.choice();
      if (!PROJECT_PATH) {
        return;
      }
    }

    let routeSource = await RouteSource(PROJECT_PATH);
    let rootRoutesFilePath = await routeSource.createRootRoutes(PROJECT_PATH);

    if (!rootRoutesFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + rootRoutesFilePath)
    );

    return rootRoutesFilePath;
  } catch (error) {
    console.log(error);
  }
};

const connectRootRoutesFile = async (PROJECT_PATH, module) => {
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

    // PATH
    let path = await vscode.window.showInputBox({
      value: "/",
      valueSelection: [2, 2],
    });

    if (!path) {
      return;
    }

    let routeSource = await RouteSource(PROJECT_PATH, module);
    let rotoRouteFilePath = await routeSource.rootRouteConnect(path);

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + rotoRouteFilePath)
    );

    return rotoRouteFilePath;
  } catch (error) {
    console.log(error);
  }
};

exports.addRoute = addRoute;
exports.createRootRoutesFile = createRootRoutesFile;
exports.connectRootRoutesFile = connectRootRoutesFile;
exports.createRouteFile = createRouteFile;
