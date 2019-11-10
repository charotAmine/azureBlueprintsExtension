
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { denodeify } from 'q';

const mkdir = denodeify(mkdirp);
const appendFile = denodeify(fs.appendFileSync);

export class FileController {

  private extensionPath: string;

  constructor(extensionPath: string) {
    this.extensionPath = extensionPath;
  }

  public async createBlueprintsWorkspace(blueprintName: string) {
    let workspace = vscode.workspace.workspaceFolders;
    if (workspace) {
      let workspacePath = workspace[0];
      let dirName = workspacePath.uri.fsPath + "/" + blueprintName;
      let blueprintJson = dirName + "/Blueprint.json";
      let assignJson = dirName + "/Assign.json";
      let artifactsDirectory = dirName + "/Artifacts";
      this.createFile(blueprintJson, "blueprint", this.extensionPath);
      this.createFile(assignJson, "assign", this.extensionPath);
      this.createDirectory(artifactsDirectory);
    }
  }

  public async createArtifactFile(blueprintName: string, kind: string, artifactName: string) {
    let workspace = vscode.workspace.workspaceFolders;
    if (workspace) {
      let workspacePath = workspace[0];
      let dirName = workspacePath.uri.fsPath + "/" + blueprintName;
      let artifactsDirectory = dirName + "/Artifacts" + "/" + artifactName + ".json";
      this.createFile(artifactsDirectory, kind, this.extensionPath);
    }
  }

  public async createDirectory(dirName: string): Promise<string> {
    await mkdir(dirName);
    return dirName;
  }

  public async createFile(newFileName: string, kind: string, extensionPath: string): Promise<string> {

    const dirName: string = path.dirname(newFileName);
    const fileExists: boolean = await this.fileExists(newFileName);

    if (!fileExists) {
      await this.createDirectory(dirName);
      fs.readFile(`${extensionPath}/assets/${kind}.json`, function (err, data) {
        if (err) {
          return console.error(err);
        }
        appendFile(newFileName, data.toString());
      });
    }

    return newFileName;
  }

  public async fileExists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.exists(path, exists => {
        resolve(exists);
      });
    });
  }

}