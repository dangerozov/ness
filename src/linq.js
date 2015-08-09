var linq = (function linq() {
	var linq = {
		range(start, count) {
			var result = []
			for (var i = start; i < count; i++) {
				result.push(i)
			}
			return result
		},
		contains(source, obj) {
			var result = false
			for (var item of source) {
				if (item == obj) {
					result = true
					break
				}
			}
			return result
		},
		except(left, right) {
			var result = []
			for (var item of left) {
				if (!right.contains(item)) result.push(item) 
			}
			return result
		},
		first(source, predicate) {
			var result = null
			for (var item of source) {
				if (predicate(item)) {
					result = item
					break
				}
			}
			return result
		},
		toArray(source) {
			var result = []
			for (var item of source) result.push(item)
			return result
		}
	}
	
	var some = Array.prototype.some
	Array.prototype.some = function(predicate) {
		if (predicate == undefined) { 
			predicate = function() { return true }
		}
		return some.call(this, predicate)
	}
	
	Array.prototype.contains = function(obj) {
		return linq.contains.call(null, this, obj)
	}
	
	Array.prototype.except = function(right) {
		return linq.except.call(null, this, right)
	}
	
	Array.prototype.first = function(predicate) {
		return linq.first.call(null, this, predicate)
	}
	
	Array.prototype.toArray = function() {
		return linq.toArray.call(null, this)
	}
	
	return linq
})()