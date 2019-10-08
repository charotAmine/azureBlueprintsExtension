# Azure Blueprints Code Generator

The Azure Blueprint Code Generator is an extention which creates an Azure Blueprint workspace with the necessary JSON files to deploy a Blueprint using code. It also creates artifacts of type Template, Rbac assignment and Policy Assignment.

## Features

First thing that this extention can do is creating a blueprint workspace : 

* Use command ** Azure Blueprints: Generate a blueprint workspace **  
![Generator](images/generator.png)

> This will generate the `Assign.json`, `Blueprint.json` and `/Artifacts` with a default template inside.

The extention can also create an Azure Blueprints artifact of type `template`, `rbac` or `policy`:

* Use command ** Azure Blueprints: Generate a blueprint Artifact **  
![artifact](images/artifact.png)

> This will generate the wanted artifact type with a default template inside.

Do you want to test your blueprint without writing scripts? No problem, we have the solution :

# Requirement : 
* Azure Powershell and Az.Blueprint Module

To import the blueprint : 
* Use command ** Azure Blueprints: Import Blueprint **  
![artifact](images/import.png)
### Requirement : 
* Blueprint workspace (Blueprint.json and Artifacts)
* Management Group Id
> This will import the blueprint to Azure. 

To publish the blueprint : 
* Use command ** Azure Blueprints: Publish Blueprint **  
![artifact](images/publish.png)
### Requirement : 
* Blueprint name
* Blueprint version
* Management Group Id
> This will publish the imported blueprint. 

To Assign the blueprint : 
* Use command ** Azure Blueprints: Assign Blueprint **  
![artifact](images/assign.png)
### Requirement : 
* Blueprint name
* Blueprint version
* Management Group Id
* Subscription Id
* Blueprint workspace (Assign.json)
> This will assign the publishd blueprint. 

NOTE : The blueprint workspace MUST be in the root ! The blueprint name in Azure will have the SAME name as the workspace !

## Release Notes

### 0.0.2

* Import a blueprint to Azure
* Publish an imported blueprint
* Assign a published blueprint

### 0.0.1

* Generate an Azure Blueprints workspace
* Generate an Azure Blueprints Artifact
