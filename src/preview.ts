import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const {
  showInputBox,
  setStatusBarMessage,
  createWebviewPanel,
  showErrorMessage
} = vscode.window;

let artifactDirectory: string | undefined;

interface BlueprintTree {
  text: string;
  nodes: Array<BlueprintTree>;
}

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

export async function blueprintPreview(context: vscode.ExtensionContext) {
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
      localResourceRoots: [vscode.Uri.file(`${context.extensionPath}/assets`)]
    }
  );
  const assetsPath = panel.webview.asWebviewUri(
    vscode.Uri.file(`${context.extensionPath}/assets`)
  );
  panel.webview.html = renderHtml(assetsPath);

  var result: BlueprintTree[];
  result = [
    {
      text: "Subscription Assigned",
      nodes: []
    }
  ];
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
  fs.readdirSync(`${artifactDirectory}/artifacts`).forEach(file => {
    var filepath = `${artifactDirectory}/artifacts/${file}`;

    var artifact = fs.readFileSync(filepath);
    var artifactObj = JSON.parse(artifact.toString());
    if (artifactObj.kind === undefined) {
      showErrorMessage(`${file} template does not contain a kind`);
    } else {
      if (artifactObj.properties.displayName) {
        var nodeName = artifactObj.properties.displayName;
      } else {
        var filename = path.parse(filepath).base;
        nodeName = path.parse(filename).name;
      }

      var found = false;
      if (artifactObj.kind === "template") {
        if (!artifactObj.properties.resourceGroup === undefined) {
          showErrorMessage(
            `${file} template does not contain a Resource Group`
          );
        } else {
          for (var i = 0; i < result[0].nodes.length; i++) {
            let element = result[0].nodes[i];
            if (element.text === artifactObj.properties.resourceGroup) {
              found = true;
              if (element.nodes) {
                element.nodes.push({
                  text: nodeName,
                  nodes: []
                });
              }
            }
          }
          if (found === false) {
            result[0].nodes.push({
              text: artifactObj.properties.resourceGroup,
              nodes: [
                {
                  text: nodeName,
                  nodes: []
                }
              ]
            });
          }
        }
      } else {
        result[0].nodes.push({
          text: nodeName,
          nodes: []
        });
      }
    }
  });
  setStatusBarMessage("POSTING THE DATA");
  panel.webview.postMessage({
    command: "message",
    payload: result
  });
}
