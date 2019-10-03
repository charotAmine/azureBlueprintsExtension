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

## Release Notes

### 0.0.1

* Generate an Azure Blueprints workspace
* Generate an Azure Blueprints Artifact
