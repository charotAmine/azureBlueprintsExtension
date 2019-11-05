import * as assert from 'assert';
import { TreeBuilder } from "../../TreeBuilder";

suite('TreeBuilder Test Suite', () => {
	test('Throw on undefined kind', () => {
		let builder = new TreeBuilder();
		assert.throws(() => 
			builder.analyseArtifactObject("ONE", {
				"properties": {
					"displayName": "<user or group TBD> : Contributor",
					"resourceGroup": "AppNetwork"
				}
			}), new Error("template does not contain a kind")
		);
		const nodes = builder.allNodes();
		assert.deepEqual(nodes, []);
	});

	test('Node text when no displayName', () => {
		let builder = new TreeBuilder();
		builder.analyseArtifactObject("ONE", {
			"kind": "template",
			"properties": {}
		});
		const nodes = builder.allNodes();
		assert.deepEqual(nodes, [{
			    "kind": "template",
				"text": "ONE",
			    "nodes": []
			}]
		);
	});

	test('Node text when no properties', () => {
		let builder = new TreeBuilder();
		builder.analyseArtifactObject("ONE", {
			"kind": "template"
		});
		const nodes = builder.allNodes();
		assert.deepEqual(nodes, [{
			    "kind": "template",
				"text": "ONE",
			    "nodes": []
			}]
		);
	});

	test('Role Assignment in an RG', () => {
		let builder = new TreeBuilder();
		builder.analyseArtifactObject("ONE", {
			"kind": "roleAssignment",
			"properties": {
				"displayName": "<user or group TBD> : Contributor",
				"resourceGroup": "AppNetwork"
			}
		});
		const nodes = builder.allNodes();
		assert.deepEqual(nodes, [
			{
				"kind": "RessourceGroup",
				"text": "AppNetwork",
				"nodes": [
					{
						"kind": "roleAssignment",
						"text": "<user or group TBD> : Contributor",
						"nodes": []
					}
				]
			}]
		);
	});

	test('Role Assignment Wihtout an RG', () => {
		let builder = new TreeBuilder();
		builder.analyseArtifactObject("ONE", {
			"kind": "roleAssignment",
			"properties": {
				"displayName": "<user or group TBD> : Contributor"
			}
		});
		const nodes = builder.allNodes();
		assert.deepEqual(nodes, [
			{
				"kind": "roleAssignment",
				"text": "<user or group TBD> : Contributor",
				"nodes": []
			}]
		);
	});

	test('Multiple Nodes in the same RG', () => {
		let builder = new TreeBuilder();
		builder.analyseArtifactObject("ONE", {
			"kind": "roleAssignment",
			"properties": {
				"displayName": "<user or group TBD> : Contributor",
				"resourceGroup": "AppNetwork"
			}
		});

		builder.analyseArtifactObject("TWO", {
			"kind": "policyAssignment",
			"properties": {
				"displayName": "Audit virtual machines without disaster recovery configured",
				"resourceGroup": "AppNetwork"
			}
		});

		const nodes = builder.allNodes();
		assert.deepEqual(nodes, [
			{
				"kind": "RessourceGroup",
				"text": "AppNetwork",
				"nodes": [
					{
						"kind": "roleAssignment",
						"text": "<user or group TBD> : Contributor",
						"nodes": []
					},
					{
						"kind": "policyAssignment",
						"text": "Audit virtual machines without disaster recovery configured",
						"nodes": []
					}
				]
			}]
		);
	});

	test('Multiple Nodes in different RGs', () => {
		let builder = new TreeBuilder();
		builder.analyseArtifactObject("ONE", {
			"kind": "roleAssignment",
			"properties": {
				"displayName": "<user or group TBD> : Read",
				"resourceGroup": "Production"
			}
		});

		builder.analyseArtifactObject("TWO", {
			"kind": "roleAssignment",
			"properties": {
				"displayName": "<user or group TBD> : Owner",
				"resourceGroup": "Staging"
			}
		});

		const nodes = builder.allNodes();
		assert.deepEqual(nodes, [
			{
				"kind": "RessourceGroup",
				"text": "Production",
				"nodes": [
					{
						"kind": "roleAssignment",
						"text": "<user or group TBD> : Read",
						"nodes": []
					}
				]
			},
			{
				"kind": "RessourceGroup",
				"text": "Staging",
				"nodes": [
					{
						"kind": "roleAssignment",
						"text": "<user or group TBD> : Owner",
						"nodes": []
					}
				]
			}]
		);
	});

});
