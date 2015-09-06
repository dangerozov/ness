nessy.EntityStore = function() {
	this.entities = []
	this.onUpdateSystems = []
	this.onDrawSystems = []
}

nessy.EntityStore.prototype = {
	update: function() {
		for (var entity of this.entities) {
			for (var system of this.onUpdateSystems) {
				var suitable = true
				for (var component of system.components) {
					suitable = entity[component] != null
				}
				if (suitable) {
					system.callback(entity)
				}
			}
		}
	},
	draw: function() {
		for (var entity of this.entities) {
			for (var system of this.onDrawSystems) {
				var suitable = true
				for (var component of system.components) {
					suitable = entity[component]
				}
				if (suitable) {
					system.callback(entity)
				}
			}
		}
	},

	onUpdate: function(components, callback) {
		this.onUpdateSystems.push({ components: components, callback: callback })
	},
	onDraw: function(components, callback) {
		this.onDrawSystems.push({ components: components, callback: callback })
	},

	add: function(entity) {
		this.entities.push(entity)
	},
	remove: function(entity) {
		for (var i = entity.id + 1; i < this.entities.length; i++) {
			this.entities[i].id = this.entities[i].id - 1
		}
		this.entities.splice(entity.id, 1)
	}
}