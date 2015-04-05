nessy.Entities = function() {
	this.raw = new Array()
}

nessy.Entities.prototype = {
	add: function(entity) {
		this.raw.push(entity)
		entity.id = this.raw.length - 1
	},
	remove: function(entity) {
		for (var i = entity.id + 1; i < this.raw.length; i++) {
			this.raw[i].id = this.raw[i].id - 1
		}
		this.raw.splice(entity.id, 1)
	}
}

nessy.entities = new nessy.Entities()