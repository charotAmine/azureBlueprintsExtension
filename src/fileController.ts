
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import { denodeify } from 'q';

const mkdir = denodeify(mkdirp);
const appendFile = denodeify(fs.appendFileSync);


export class FileController {

    public async createBlueprintsWorkspace(blueprintName : string){
        let workspace = vscode.workspace.workspaceFolders
        if(workspace)
        {
            let workspacePath = workspace[0]
            let dirName = workspacePath.uri.fsPath + "\\" + blueprintName
            let blueprintJson = dirName + "\\Blueprint.json"
            let assignJson = dirName + "\\Assign.json"
            let artifactsDirectory = dirName + "\\Artifacts"
            
            this.createFiles([blueprintJson,assignJson])
            this.createDirectory(artifactsDirectory)
        }
      }

  private async createFiles(newFileNames: string[]): Promise<string[]> {
    const fileCreationPromises: Array<
      Promise<string>
    > = newFileNames.map(fileName => this.createFile(fileName));
    return Promise.all(fileCreationPromises);
  }

  private async createDirectory(dirName: string): Promise<string> {
    await mkdir(dirName);    
    return dirName;
  }

  private async createFile(newFileName: string): Promise<string> {

    const dirName: string = path.dirname(newFileName);
    const fileExists: boolean = await this.fileExists(newFileName);

    if (!fileExists) {
      await this.createDirectory(dirName);
      await appendFile(newFileName,"");
    }

    return newFileName;
  }

  private async fileExists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.exists(path, exists => {
        resolve(exists);
      });
    });
  }

}