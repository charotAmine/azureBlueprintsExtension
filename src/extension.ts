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

	context.subscriptions.push(generateBlueprint);
	context.subscriptions.push(createTemplateArtifact);

}

export function deactivate() { }
