import * as vscode from "vscode";
import * as fs from "fs";
import { TreeBuilder } from "./TreeBuilder";

const {
  showInputBox,
  setStatusBarMessage,
  createWebviewPanel,
  showErrorMessage
} = vscode.window;

let artifactDirectory: string | undefined;

function renderHtml(assetsPath: vscode.Uri): string {
  return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Azure BluePrint Preview</title>
    <link rel="stylesheet" href="${assetsPath}/main.css">
	</head>
    <body>
    <div>
        <h3>Blueprints Viewer</h3>
        <div id="app">
            <tree />
        </div>
        <script src="${assetsPath}/vue.js"></script>
        <script src="${assetsPath}/main.js"></script>
    </body>
	</html>`;
}

export async function blueprintPreview(extensionPath: string) {
  artifactDirectory = await showInputBox({
    value: artifactDirectory,
    prompt: "Workspace Directory",
    placeHolder: "Enter the name of the workspace or its path",
    password: false
  });
  if (artifactDirectory === undefined || artifactDirectory.length <= 0) {
    setStatusBarMessage("No root name provided");
    return;
  }
  let panel = createWebviewPanel(
    "blueprintsViewer",
    "Blueprints Viewer",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(`${extensionPath}/assets`)]
    }
  );
  const assetsPath = panel.webview.asWebviewUri(
    vscode.Uri.file(`${extensionPath}/assets`)
  );
  panel.webview.html = renderHtml(assetsPath);
  if (
    artifactDirectory.indexOf("/") < 0 &&
    artifactDirectory.indexOf("\\") < 0
  ) {
    let workspace = vscode.workspace.workspaceFolders;
    if (workspace) {
      let workspacePath = workspace[0];
      artifactDirectory = workspacePath.uri.fsPath + "/" + artifactDirectory;
    }
  }

  let treeBuilder = new TreeBuilder();
  fs.readdirSync(`${artifactDirectory}/artifacts`).forEach(file => {
    try {
      const filepath = `${artifactDirectory}/artifacts/${file}`;
      const artifact = fs.readFileSync(filepath);
      const artifactObj = JSON.parse(artifact.toString());
      treeBuilder.analyseArtifactObject(file, artifactObj);
    } catch (error) {
      showErrorMessage(`${file} : ${error}`);
    }
  });

  setStatusBarMessage("Posting analysed data");
  let allNodes = treeBuilder.allNodes();
  panel.webview.postMessage({
    command: "message",
    payload: [{
      text: "Subscription Assigned",
      kind: "Subscription",
      nodes: allNodes
    }]
  });
}
