nessy.entities = new Array()

nessy.entities.add = function(entity) {
	this.push(entity)
	entity.id = this.length - 1
}

nessy.entities.remove = function(entity) {
	for (var i = entity.id + 1; i < this.length; i++) {
		this[i].id = this[i].id - 1
	}
	this.splice(entity.id, 1)
}

nessy.entities.where = function*(predicate) {
	for (var entity of this) {
		if (predicate(entity)) {
			yield entity
		}
	}
}