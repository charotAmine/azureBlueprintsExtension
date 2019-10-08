import * as vscode from 'vscode';
import { FileController } from './fileController';

export function activate(context: vscode.ExtensionContext) {
	const blueprintWorkspace = new FileController(context.extensionPath);
	var blueprintRootName: string | undefined;
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
	context.subscriptions.push(generateBlueprint);
	context.subscriptions.push(createTemplateArtifact);
	context.subscriptions.push(importBlueprint);
	context.subscriptions.push(publishBlueprint);


}

export function deactivate() { }
