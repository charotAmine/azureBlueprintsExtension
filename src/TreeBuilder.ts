export interface TreeNode {
  text: string;
  kind: string;
  nodes: Array<TreeNode>;
}

export class TreeBuilder {
  private resourceGroups: {
    [key: string]: TreeNode;
  };
  private notResourceGroups: TreeNode[];
  constructor() {
    this.resourceGroups = {};
    this.notResourceGroups = [];
  }
  public analyseArtifactObject(filename: string, artifactObj: any) {
    if (artifactObj.kind === undefined) {
      throw new Error("template does not contain a kind");
    }
    var node: TreeNode = {
      text: filename,
      kind: artifactObj.kind,
      nodes: []
    };
    if (artifactObj.properties && artifactObj.properties.displayName) {
      node.text = artifactObj.properties.displayName;
    }
    if (!artifactObj.properties || artifactObj.properties.resourceGroup === undefined) {
        this.notResourceGroups.push(node);
        return;
    }
    let ressourceGroupName = artifactObj.properties.resourceGroup;
    if (!this.resourceGroups.hasOwnProperty(ressourceGroupName)) {
      this.resourceGroups[ressourceGroupName] = {
        kind: "RessourceGroup",
        text: ressourceGroupName,
        nodes: []
      };
    }
    const resourceGroupNode = this.resourceGroups[ressourceGroupName];
    resourceGroupNode.nodes.push(node);
  }
  public allNodes(): TreeNode[] {
    return this.notResourceGroups.concat(Object.values(this.resourceGroups));
  }
}
