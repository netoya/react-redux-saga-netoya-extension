const vscode = require("vscode");
const ModulesSource = require("../Modules/ModulesSource");
const ProjectSource = require("../Project/ProjectSource");
const ReducerSource = require("./ReducerSource");

const createReducerFile = async (PROJECT_PATH, module) => {
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

    let reducerSource = await ReducerSource(PROJECT_PATH, module);

    let reducerFilePath = await reducerSource.createReducerFile();

    if (!reducerFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + reducerFilePath)
    );

    return reducerFilePath;
  } catch (error) {
    console.log(error);
  }
};

const addReducerList = async (PROJECT_PATH, module) => {
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

    // NAME
    let name = await vscode.window.showInputBox({
      value: "",
      title: "Nombre de la variable lista",
    });

    if (!name) {
      return;
    }

    let reducerSource = await ReducerSource(PROJECT_PATH, module);
    await reducerSource.addReducerList(name);

    let reducerFilePath = await reducerSource.getPath();

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + reducerFilePath)
    );

    return reducerFilePath;
  } catch (error) {
    console.log(error);
  }
};

const createRootReducerFile = async (PROJECT_PATH) => {
  try {
    // PROJECT
    if (!PROJECT_PATH) {
      let projectSource = ProjectSource();
      PROJECT_PATH = await projectSource.choice();
      if (!PROJECT_PATH) {
        return;
      }
    }

    let reducerSource = await ReducerSource(PROJECT_PATH);
    let rootReducerFilePath = await reducerSource.createRootReducer(
      PROJECT_PATH
    );

    if (!rootReducerFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + rootReducerFilePath)
    );

    return rootReducerFilePath;
  } catch (error) {
    console.log(error);
  }
};

const connectRootReducerFile = async (PROJECT_PATH, module) => {
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

    let reducerSource = await ReducerSource(PROJECT_PATH, module);
    let rootReducerFilePath = await reducerSource.rootReducerConnect();

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + rootReducerFilePath)
    );

    return rootReducerFilePath;
  } catch (error) {
    console.log(error);
  }
};

exports.addReducerList = addReducerList;
exports.createRootReducerFile = createRootReducerFile;
exports.connectRootReducerFile = connectRootReducerFile;
exports.createReducerFile = createReducerFile;
