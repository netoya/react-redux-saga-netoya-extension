const vscode = require("vscode");
const fs = require("fs");
const {
  addRoute,
  createRouteFile,
  createRootRoutesFile,
  connectRootRoutesFile,
} = require("./modules/Route/RouteCommands");
const { createPageFile } = require("./modules/Pages/PagesCommands");
const {
  createReducerFile,
  addReducerList,
  createRootReducerFile,
  connectRootReducerFile,
} = require("./modules/Reducer/ReducerCommands");
const {
  createRootSagaFile,
  createSagaFile,
  connectRootSagaFile,
} = require("./modules/Saga/SagaCommands");
const {
  createConstantFile,
  addConstant,
} = require("./modules/Constants/ConstantCommands");
const { addApiFunction, createApiFile } = require("./modules/Api/ApiCommands");
const { mainMenuChoice } = require("./modules/Menu/MenuCommands");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  console.log(
    'Congratulations, your extension "react-redux-saga-netoya" is now active!'
  );

  // API
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.api.createFile",
      createApiFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.api.addFunction",
      addApiFunction
    )
  );

  // CONSTANT
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.constant.createFile",
      createConstantFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.constant.addConstant",
      addConstant
    )
  );

  // MAIN
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.main.menuChoice",
      mainMenuChoice
    )
  );

  // PAGE
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.page.createFile",
      createPageFile
    )
  );

  // PROJECT
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.project.createRootRoutesFile",
      createRootRoutesFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.project.connectRootRoutesFile",
      connectRootRoutesFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.project.createRootReducerFile",
      createRootReducerFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.project.connectRootReducerFile",
      connectRootReducerFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.project.createRootSagaFile",
      createRootSagaFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.project.connectRootSagaFile",
      connectRootSagaFile
    )
  );

  // REDUCER
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.reducer.createFile",
      createReducerFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.reducer.addList",
      addReducerList
    )
  );

  // ROUTER
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.route.createFile",
      createRouteFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.route.add",
      addRoute
    )
  );

  // SAGA
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "react-redux-saga-netoya.saga.createFile",
      createSagaFile
    )
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
