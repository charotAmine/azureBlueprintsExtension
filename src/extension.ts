import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


import { FileController } from './fileController';
interface blueprintTree {
	text: string;
	nodes: Array<blueprintTree>;
}
export function activate(context: vscode.ExtensionContext) {
	const blueprintWorkspace = new FileController(context.extensionPath);
	var blueprintRootName: string | undefined;
	var artifactDirectory: string | undefined;
	let given = false;
	const generateBlueprint = vscode.commands.registerCommand(
		'extension.generateBlueprintsWorkspace',
		async () => {
			try {
				blueprintRootName = await vscode.window.showInputBox({ value: "Infrastracture", prompt: "Blueprint root folder", placeHolder: "Blueprint root folder name", password: false });
				if (blueprintRootName == undefined || blueprintRootName.length <= 0) {
					vscode.window.setStatusBarMessage("No root name provided");
				}
				else {
					await blueprintWorkspace.createBlueprintsWorkspace(blueprintRootName);
					vscode.window.showInformationMessage("Azure Blueprints workspace has been created");
					given = true;
				}
			} catch (err) {
				if (err && err.message) {
					vscode.window.showErrorMessage(err.message);
				}
			}
		}
	);

	const createTemplateArtifact = vscode.commands.registerCommand(
		'extension.createBlueprintArtifact',
		async () => {
			try {
				blueprintRootName = await vscode.window.showInputBox({ value: blueprintRootName, prompt: "Blueprint root folder", placeHolder: "Blueprint root folder name", password: false });
				if (blueprintRootName == undefined || blueprintRootName.length <= 0) {
					vscode.window.setStatusBarMessage("No root name provided");
				}
				else {
					let artifactFileName = await vscode.window.showInputBox({ value: "vnet", prompt: "Artifact file name", placeHolder: "Artifact file name", password: false });
					if (artifactFileName == undefined || artifactFileName.length <= 0) {
						vscode.window.setStatusBarMessage("No file name provided");
					}
					else {
						let artifact = await vscode.window.showQuickPick(["template", "rbac", "Policy"], { placeHolder: "Artifact file name", canPickMany: false });
						if (artifact == undefined || artifact.length <= 0) {
							vscode.window.setStatusBarMessage("No artifact provided");
						}
						else {
							blueprintWorkspace.createArtifactFile(blueprintRootName, artifact, artifactFileName);
							vscode.window.showInformationMessage("Azure Blueprints Artifact has been created");
						}
					}
				}
			} catch (err) {
				if (err && err.message) {
					vscode.window.showErrorMessage(err.message);
				}
			}
		}
	);

	const importBlueprint = vscode.commands.registerCommand(
		'extension.importBlueprint',
		async () => {
			try {
				blueprintRootName = await vscode.window.showInputBox({ value: blueprintRootName, prompt: "Blueprint root folder", placeHolder: "Blueprint root folder name", password: false });
				if (blueprintRootName == undefined || blueprintRootName.length <= 0) {
					vscode.window.setStatusBarMessage("No root name provided");
				}
				else {
					let managementGroupName = await vscode.window.showInputBox({ value: "myManagementGroup", prompt: "Management Group name", placeHolder: "Management Group name", password: false });
					if (managementGroupName == undefined || managementGroupName.length <= 0) {
						vscode.window.setStatusBarMessage("No management group provided");
					}
					else {
						let terminal = (<any>vscode.window).createTerminal("Import blueprint");
						terminal.show(true);
						terminal.sendText("POWERSHELL Login-AzAccount", true);
						terminal.sendText(`POWERSHELL Import-AzBlueprintWithArtifact -Name ${blueprintRootName} -ManagementGroupId ${managementGroupName} -InputPath ./${blueprintRootName}`, true);
					}
				}
			} catch (err) {
				if (err && err.message) {
					vscode.window.showErrorMessage(err.message);
				}
			}
		}
	);

	const publishBlueprint = vscode.commands.registerCommand(
		'extension.publishBlueprint',
		async () => {
			try {
				blueprintRootName = await vscode.window.showInputBox({ value: blueprintRootName, prompt: "Blueprint name", placeHolder: "Blueprint name", password: false });
				if (blueprintRootName == undefined || blueprintRootName.length <= 0) {
					vscode.window.setStatusBarMessage("No name provided");
				}
				else {
					let version = await vscode.window.showInputBox({ value: "1.0.0", prompt: "Blueprint version", placeHolder: "Blueprint version", password: false });
					if (version == undefined || version.length <= 0) {
						vscode.window.setStatusBarMessage("No version provided");
					}
					else {
						let managementGroupName = await vscode.window.showInputBox({ value: "myManagementGroup", prompt: "Management Group name", placeHolder: "Management Group name", password: false });
						if (managementGroupName == undefined || managementGroupName.length <= 0) {
							vscode.window.setStatusBarMessage("No management group provided");
						}
						else {
							let terminal = (<any>vscode.window).createTerminal("Import blueprint");
							terminal.show(true);
							terminal.sendText("POWERSHELL Login-AzAccount", true);
							terminal.sendText(`POWERSHELL $createdBlueprint = Get-AzBlueprint -ManagementGroupId ${managementGroupName} -Name ${blueprintRootName}; Publish-AzBlueprint -Blueprint $createdBlueprint -Version ${version}`, true);
						}
					}
				}
			} catch (err) {
				if (err && err.message) {
					vscode.window.showErrorMessage(err.message);
				}
			}
		}
	);

	const assignBlueprint = vscode.commands.registerCommand(
		'extension.assignBlueprint',
		async () => {
			try {
				blueprintRootName = await vscode.window.showInputBox({ value: blueprintRootName, prompt: "Blueprint root folder", placeHolder: "Blueprint root folder name", password: false });
				if (blueprintRootName == undefined || blueprintRootName.length <= 0) {
					vscode.window.setStatusBarMessage("No root name provided");
				}
				else {
					let subscriptionId = await vscode.window.showInputBox({ value: "xxxx-xxxx-xxxx", prompt: "Subscription Id", placeHolder: "Fill your subscription Id", password: false });
					if (subscriptionId == undefined || subscriptionId.length <= 0) {
						vscode.window.setStatusBarMessage("No subscription Id provided");
					}
					else {
						let managementGroupName = await vscode.window.showInputBox({ value: "myManagementGroup", prompt: "Management Group name", placeHolder: "Management Group name", password: false });
						if (managementGroupName == undefined || managementGroupName.length <= 0) {
							vscode.window.setStatusBarMessage("No management group provided");
						}
						else {
							let terminal = (<any>vscode.window).createTerminal("Import blueprint");
							terminal.show(true);
							terminal.sendText("POWERSHELL Login-AzAccount", true);
							terminal.sendText(`POWERSHELL $createdBlueprint = Get-AzBlueprint -ManagementGroupId ${managementGroupName} -Name ${blueprintRootName}; New-AzBlueprintAssignment -Name ${blueprintRootName} -Blueprint $createdBlueprint -AssignmentFile ./${blueprintRootName}/Assign.json -SubscriptionId ${subscriptionId}`, true);
						}
					}
				}
			} catch (err) {
				if (err && err.message) {
					vscode.window.showErrorMessage(err.message);
				}
			}
		}
	);

	const blueprintPreview = vscode.commands.registerCommand(
		'extension.blueprintPreview',
		async () => {
			artifactDirectory = await vscode.window.showInputBox({ value: artifactDirectory, prompt: "Workspace Directory", placeHolder: "Enter the name of the workspace or its path", password: false });
			if (artifactDirectory == undefined || artifactDirectory.length <= 0) {
				vscode.window.setStatusBarMessage("No root name provided");
			}
			else {
				let panel = vscode.window.createWebviewPanel(
					'blueprintsViewer',
					'Blueprints Viewer',
					vscode.ViewColumn.Beside,
					{
						enableScripts: true,
						localResourceRoots: [vscode.Uri.file(`${context.extensionPath}/assets`)]
					}
				);
				const assetsPath = panel.webview.asWebviewUri(vscode.Uri.file(`${context.extensionPath}/assets`));

				panel.webview.html = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>TreeJS - Demo Page</title>
	
		<script src="${assetsPath}/jquery-3.4.1.min.js"></script>
	
		<script src="${assetsPath}/bootstrap.min.js"></script>
		<script src="${assetsPath}/bootstrap-treeview.js"></script>
		
	
		<link rel="stylesheet" href="${assetsPath}/bootstrap-treeview.css" id="treejs_styles">
		<link rel="stylesheet" href="${assetsPath}/bootstrap.min.css" id="treejs_styles">
	</head>
	<body>
	<div class="row">
		<div id="tree"></div>
	</div>
	<script>
	
		  $(window).on('message', function(e) {
			  var tree = e.originalEvent.data.payload
	
				initTree(tree);
		});
	  function initTree(treeData) {
		  $('#tree').treeview({
			  data: treeData,
			  enableLinks: true
		  });
		  
		  // collapses all nodes
		  $('#tree').treeview('collapseAll', { silent: true });
	  }
	  
	
	</script>
	</body>
	</html>`

				var result: blueprintTree[];
				result = [{ text: "Subscription Assigned", nodes: [] }]
				if (artifactDirectory.indexOf("/") < 0 && artifactDirectory.indexOf("\\") < 0) {
					let workspace = vscode.workspace.workspaceFolders;
					if (workspace) {
						let workspacePath = workspace[0];
						artifactDirectory = workspacePath.uri.fsPath + "/" + artifactDirectory;
					}
				}
				fs.readdirSync(`${artifactDirectory}/artifacts`).forEach(file => {

					var filepath = `${artifactDirectory}/artifacts/${file}`

					var artifact = fs.readFileSync(filepath)
					var artifactObj = JSON.parse(artifact.toString())
					if (artifactObj.kind == undefined) {
						vscode.window.showErrorMessage(`${file} template does not contain a kind`);
					}
					else {
						if (artifactObj.properties.displayName) {
							var nodeName = artifactObj.properties.displayName
						} else {
							var filename = path.parse(filepath).base;
							nodeName = path.parse(filename).name
						}

						var found = false
						if (artifactObj.kind == "template") {
							if (!artifactObj.properties.resourceGroup == undefined) {
								vscode.window.showErrorMessage(`${file} template does not contain a Resource Group`);
							} else {
								for (var i = 0; i < result[0].nodes.length; i++) {
									let element = result[0].nodes[i]
									if (element.text == artifactObj.properties.resourceGroup) {
										found = true
										if (element.nodes) {
											element.nodes.push({ text: nodeName, nodes: [] })
										}
									}
								}
								if (found == false) {
									result[0].nodes.push({ text: artifactObj.properties.resourceGroup, nodes: [{ text: nodeName, nodes: [] }] })
								}
							}
						} else {
							result[0].nodes.push({ text: nodeName, nodes: [] })
						}
					}

				});

				panel.webview.postMessage({ command: 'message', payload: result });
			}
		}
	);

	context.subscriptions.push(generateBlueprint);
	context.subscriptions.push(createTemplateArtifact);
	context.subscriptions.push(importBlueprint);
	context.subscriptions.push(publishBlueprint);
	context.subscriptions.push(assignBlueprint);
	context.subscriptions.push(blueprintPreview);
}

export function deactivate() { }
