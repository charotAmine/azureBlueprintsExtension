// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FileController } from './fileController';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'extension.generateBlueprintsWorkspace',
		async () => {
		  const blueprintWorkspace = new FileController();
	
		  try {
				await blueprintWorkspace.createBlueprintsWorkspace("infrastructure");
				vscode.window.showInformationMessage("Azure Blueprints workspace has been created");

		  } catch (err) {
			if (err && err.message) {
			  vscode.window.showErrorMessage(err.message);
			}
		  }
		}
	  );

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
