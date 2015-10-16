nessy.tree = (() => {
	
	var tree = {};
	
	tree.node = value => ({
		parent: null,
		nodes: [],
		
		value: value
	});
	
	var first = (source, predicate) => {
		var result = null;
		for (var item of source) {
			if (predicate(item)) {
				result = item;
				break;
			}
		}
		return result;
	};
	
	tree.addChild = (root, node) => {
		root.nodes.push(node);
		node.parent = root;
	};
	
	tree.removeChild = (root, node) => {
		root.nodes.splice(root.nodes.indexOf(node), 1);
		node.parent = null;
	};
	
	tree.addDescendant = (root, node, isChild) => {
		var parent = first(root.nodes, child => isChild(node, child));
	
		if (parent !== null) {
			addDescendant(parent, node, isChild);
			return;
		}
	
		var child = first(root.nodes, child => isChild(child, node));
	
		if (child !== null) {
			removeChild(root, child);
			addChild(root, node);
			addChild(node, child);		
			return;
		}
	
		addChild(root, node);
	};
	
	return tree;
})();