const vscode = require("vscode");
const { createApiFile, addApiFunction } = require("../Api/ApiCommands");
const {
  createConstantFile,
  addConstant,
} = require("../Constants/ConstantCommands");
const { createPageFile } = require("../Pages/PagesCommands");
const {
  createReducerFile,
  addReducerList,
  createRootReducerFile,
  connectRootReducerFile,
} = require("../Reducer/ReducerCommands");
const {
  createRootRoutesFile,
  connectRootRoutesFile,
  createRouteFile,
  addRoute,
} = require("../Route/RouteCommands");
const {
  createRootSagaFile,
  connectRootSagaFile,
  createSagaFile,
} = require("../Saga/SagaCommands");

const mainMenuChoice = async (PROJECT_PATH, module) => {
  try {
    // MENUS

    let menus = [
      {
        label: "Api",
        description: "api",
      },
      {
        label: "Constant",
        description: "constant",
      },
      {
        label: "Page",
        description: "page",
      },
      {
        label: "Project",
        description: "project",
      },
      {
        label: "Reducer",
        description: "reducer",
      },
      {
        label: "Route",
        description: "route",
      },
      {
        label: "Saga",
        description: "saga",
      },
    ];

    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "api":
        await apiMenuChoice();
        break;
      case "constant":
        await constantMenuChoice();
        break;
      case "page":
        await pageMenuChoice();
        break;
      case "project":
        await projectMenuChoice();
        break;
      case "reducer":
        await reducerMenuChoice();
        break;
      case "route":
        await routeMenuChoice();
        break;
      case "saga":
        await sagaMenuChoice();
        break;

      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

const apiMenuChoice = async () => {
  try {
    // MENUS
    let menus = [
      {
        label: "Api: add function",
        description: "react-redux-saga-netoya.api.addFunction",
      },
      {
        label: "Api: create file",
        description: "react-redux-saga-netoya.api.createFile",
      },
    ];
    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "react-redux-saga-netoya.api.createFile":
        await createApiFile();
        break;

      case "react-redux-saga-netoya.api.addFunction":
        await addApiFunction();
        break;

      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

const constantMenuChoice = async () => {
  try {
    // MENUS
    let menus = [
      {
        label: "Constant: add constant",
        description: "react-redux-saga-netoya.constant.createFile",
      },
      {
        label: "Constant: create file",
        description: "react-redux-saga-netoya.constant.addConstant",
      },
    ];
    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "react-redux-saga-netoya.constant.createFile":
        await createConstantFile();
        break;

      case "react-redux-saga-netoya.constant.addConstant":
        await addConstant();
        break;

      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

const pageMenuChoice = async () => {
  try {
    // MENUS
    let menus = [
      {
        label: "Page: create file",
        description: "react-redux-saga-netoya.page.createFile",
      },
    ];
    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "react-redux-saga-netoya.page.createFile":
        await createPageFile();
        break;

      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

const projectMenuChoice = async () => {
  try {
    // MENUS
    let menus = [
      {
        label: "Project: create root routes file",
        description: "react-redux-saga-netoya.project.createRootRoutesFile",
      },
      {
        label: "Project: connect root routes file",
        description: "react-redux-saga-netoya.project.connectRootRoutesFile",
      },
      {
        label: "Project: create root reducer file",
        description: "react-redux-saga-netoya.project.createRootReducerFile",
      },
      {
        label: "Project: connect root reducer file",
        description: "react-redux-saga-netoya.project.connectRootReducerFile",
      },
      {
        label: "Project: create root saga file",
        description: "react-redux-saga-netoya.project.createRootSagaFile",
      },
      {
        label: "Project: connect root saga file",
        description: "react-redux-saga-netoya.project.connectRootSagaFile",
      },
    ];
    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "react-redux-saga-netoya.project.createRootRoutesFile":
        await createRootRoutesFile();
        break;

      case "react-redux-saga-netoya.project.connectRootRoutesFile":
        await connectRootRoutesFile();
        break;

      case "react-redux-saga-netoya.project.createRootReducerFile":
        await createRootReducerFile();
        break;

      case "react-redux-saga-netoya.project.connectRootReducerFile":
        await connectRootReducerFile();
        break;

      case "react-redux-saga-netoya.project.createRootSagaFile":
        await createRootSagaFile();
        break;

      case "react-redux-saga-netoya.project.connectRootSagaFile":
        await connectRootSagaFile();
        break;

      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

const reducerMenuChoice = async () => {
  try {
    // MENUS
    let menus = [
      {
        label: "Reducer: create file",
        description: "react-redux-saga-netoya.reducer.createFile",
      },
      {
        label: "Reducer: add list",
        description: "react-redux-saga-netoya.reducer.addList",
      },
    ];
    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "react-redux-saga-netoya.reducer.createFile":
        await createReducerFile();
        break;
      case "react-redux-saga-netoya.reducer.addList":
        await addReducerList();
        break;

      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

const routeMenuChoice = async () => {
  try {
    // MENUS
    let menus = [
      {
        label: "Route: add route",
        description: "react-redux-saga-netoya.route.createFile",
      },
      {
        label: "Route: create file",
        description: "react-redux-saga-netoya.route.add",
      },
    ];
    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "react-redux-saga-netoya.route.createFile":
        await createRouteFile();
        break;
      case "react-redux-saga-netoya.route.add":
        await addRoute();
        break;
      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

const sagaMenuChoice = async () => {
  try {
    // MENUS
    let menus = [
      {
        label: "Saga: create file",
        description: "react-redux-saga-netoya.saga.createFile",
      },
    ];
    let menu = null;
    if (menus.length == 1) {
      menu = menus[0];
    } else {
      menu = await vscode.window.showQuickPick(menus);
    }

    if (!menu) {
      return;
    }

    switch (menu.description) {
      case "react-redux-saga-netoya.saga.createFile":
        await createSagaFile();
        break;
      default:
        break;
    }

    console.log({ menu });
  } catch (error) {
    console.log(error);
  }
};

exports.mainMenuChoice = mainMenuChoice;
