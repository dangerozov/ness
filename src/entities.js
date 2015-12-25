nessy.EntityStore = function() {
	this.entities = [];
	this.onUpdateSystems = [];
	this.onDrawSystems = [];
};

nessy.EntityStore.prototype = {
	update: function() {
		this.entities.forEach(entity => {
			this.onUpdateSystems
				.filter(system => system.components.all(component => entity[component] !== undefined))
				.forEach(system => system.callback(entity));
		});
	},
	draw: function() {
		this.entities.forEach(entity => {
			this.onDrawSystems
				.filter(system => system.components.all(component => entity[component] !== undefined))
				.forEach(system => system.callback(entity));
		});
	},

	onUpdate: function(components, callback) {
		this.onUpdateSystems.push({ components: components, callback: callback });
	},
	onDraw: function(components, callback) {
		this.onDrawSystems.push({ components: components, callback: callback });
	},

	add: function(entity) {
		this.entities.push(entity);
	},
	remove: function(entity) {
		for (var i = entity.id + 1; i < this.entities.length; i++) {
			this.entities[i].id = this.entities[i].id - 1;
		}
		this.entities.splice(entity.id, 1);
	}
};