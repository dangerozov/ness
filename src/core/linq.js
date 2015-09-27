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
		},
		aggregate(source, base, callback) {
			var startIndex = 0
			if (callback == undefined) {
				if (source.length < 1) throw "Can't aggregate empty array"
				
				callback = base
				base = source[0]
				startIndex = 1
			}
			
			for(var i = startIndex; i < source.length; i++) {
				base = callback(base, source[i])
			}
			return base
		},
		min(source, base) {
			return source.aggregate(base, function(accumulate, item) {
				if (accumulate < item) return accumulate
				return item
			})
		},
		max(source, base) {
			return source.aggregate(base, function(accumulate, item) {
				if (accumulate > item) return accumulate
				return item
			})
		},
		all(source, predicate) {
			for(var item of source) {
				if (!predicate(item)) return false;
			}
			return true;
		}
	}
	
	var some = Array.prototype.some
	Array.prototype.some = function(predicate) {
		if (predicate == undefined) { 
			predicate = function() { return true }
		}
		return some.call(this, predicate)
	}
	
	Array.prototype.all = function(obj) {
		return linq.all.call(null, this, obj)
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
	
	Array.prototype.aggregate = function(accumulate, callback) {
		return linq.aggregate.call(null, this, accumulate, callback)
	}
	
	Array.prototype.min = function(base) {
		return linq.min.call(null, this, base)
	}
	
	Array.prototype.max = function(base) {
		return linq.max.call(null, this, base)
	}
	
	return linq
})()