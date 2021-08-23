const vscode = require("vscode");
const fs = require("fs");

module.exports = () => ({
  async choice() {
    let folders = vscode.workspace.workspaceFolders;

    if (folders.length < 1) {
      vscode.window.showInformationMessage("Open a folder you want work with.");
      return;
    }

    folders = folders.map((folder) => {
      return {
        label: folder.name,
        detail: folder.uri.fsPath,
      };
    });

    let folder = null;
    if (folders.length == 1) {
      folder = folders[0];
    } else {
      folder = await vscode.window.showQuickPick(folders, {
        matchOnDetail: true,
      });
    }

    if (!folder) {
      return;
    }

    return folder.detail;
  },
  async createRootsFolder(PROJECT_PATH) {
    let rootsPath = "/src/roots";

    if (await fs.existsSync(PROJECT_PATH + rootsPath)) {
      return rootsPath;
    }

    await fs.mkdirSync(PROJECT_PATH + rootsPath);

    return rootsPath;
  },
});
