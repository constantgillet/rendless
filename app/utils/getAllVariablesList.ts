/**
 * Get all variables from the tree and return them as a list
 * @param tree
 * @returns Array<string>
 */
export const getAllVariablesList = (tree: Tree) => {
	const variableList: Array<string> = [];

	const findVariables = (node: Tree) => {
		if (node.variables) {
			node.variables.forEach((variable) => {
				if (!variableList.includes(variable.name)) {
					variableList.push(variable.name);
				}
			});
		}

		if (node.type === "text") {
			const matches = node.content.match(/{{(.*?)}}/g);
			if (matches) {
				matches.forEach((match) => {
					const variable = match.replace("{{", "").replace("}}", "");
					if (!variableList.includes(variable)) {
						variableList.push(variable);
					}
				});
			}
		}

		if (node.children) {
			node.children.forEach((child) => {
				findVariables(child);
			});
		}
	};

	findVariables(tree);

	return variableList;
};
