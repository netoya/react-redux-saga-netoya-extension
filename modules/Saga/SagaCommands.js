const vscode = require("vscode");
const ModulesSource = require("../Modules/ModulesSource");
const ProjectSource = require("../Project/ProjectSource");
const SagaSource = require("./SagaSource");

const createSagaFile = async (PROJECT_PATH, module) => {
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

    let sagaSource = await SagaSource(PROJECT_PATH, module);

    let sagaFilePath = await sagaSource.createSagaFile();

    if (!sagaFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + sagaFilePath)
    );

    return sagaFilePath;
  } catch (error) {
    console.log(error);
  }
};

const createRootSagaFile = async (PROJECT_PATH) => {
  try {
    // PROJECT
    if (!PROJECT_PATH) {
      let projectSource = ProjectSource();
      PROJECT_PATH = await projectSource.choice();
      if (!PROJECT_PATH) {
        return;
      }
    }

    let sagaSource = await SagaSource(PROJECT_PATH);
    let rootSagaFilePath = await sagaSource.createRootSaga(PROJECT_PATH);

    if (!rootSagaFilePath) {
      return;
    }

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + rootSagaFilePath)
    );

    return rootSagaFilePath;
  } catch (error) {
    console.log(error);
  }
};

const connectRootSagaFile = async (PROJECT_PATH, module) => {
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

    let sagaSource = await SagaSource(PROJECT_PATH, module);
    let rootSagaFilePath = await sagaSource.rootSagaConnect();

    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(PROJECT_PATH + rootSagaFilePath)
    );

    return rootSagaFilePath;
  } catch (error) {
    console.log(error);
  }
};

exports.createRootSagaFile = createRootSagaFile;
exports.connectRootSagaFile = connectRootSagaFile;
exports.createSagaFile = createSagaFile;
