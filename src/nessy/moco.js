var timer = {
	previous: 0,
	delta: 0,
	update: function(elapsedTotal) {
		timer.delta = (elapsedTotal - timer.previous) / 1000
		timer.previous = elapsedTotal
	}
}

function yield() {
	return function ctor() {
		return function update() {
			return true
		}
	}
}

function nextFrame() {
	return function ctor() {
		var finished = false
		return function update() {
			return finished || !(finished = true)
		}
	}
}

function call(func) {
	return function ctor() {
		return function update() {
			func()
			return true
		}
	}
}

function loadImage(path) {
	return function ctor() {
		var image = new Image()
		image.loaded = false
		image.onload = function() {
			this.loaded = true
		}
		image.src = path

		return function update() {
			return image.loaded
		}
	}
}

function wait(time) {
	return function ctor() {
		var elapsed = 0

		return function update() {
			elapsed += timer.delta
			return elapsed >= time
		}
	}
}

function run(update) {
	//var skip = 0
	var __update = function(elapsedTotal) {
		window.requestAnimationFrame(__update)
		/*if (skip < 100) {
			skip++
		}
		else {*/
			timer.update(elapsedTotal)
			update()
			//skip = 0
		//}
	}
	window.requestAnimationFrame(__update)
}

function serial(taskCtors) {
	return function ctor() {
		var e = getEnumerator(taskCtors)
		var current = e.next()
		var task = current.done ? yield() : current.value()
		task.finished = false
		return function update() {

			while (!task.finished && (task.finished = task()) && !current.done && !(current = e.next()).done) {
				task = current.value()
				task.finished = false
			}

			return task.finished
		}
	}
}

function parallel(taskCtors) {
	return function ctor() {
		var e = getEnumerator(taskCtors)
		var current = e.next()
		var tasks 
		return function update() {

		}
	}
}

function repeat(taskCtor) {
	return function ctor() {
		var task = taskCtor()
		task.finished = false
		return function update() {

			while(!task.finished && (task.finished = task())) {
				task = taskCtor()
				task.finished = false
			}

			return false
		}
	}
}

function* getEnumerator(array) {
	for (var i = 0; i < array.length; i++) {
		yield array[i]
	}
}

var game = serial([
	loadImage("pcfranklin_full.jpg"),
	call(function() { console.log("pcfranklin_full.jpg loaded") }),
	call(function() { console.log("3 sec") }),
	wait(1),
	call(function() { console.log("2 sec") }),
	wait(1),
	call(function() { console.log("1 sec") }),
	wait(1),
	loadImage("pcfranklin_full1.jpg"),
	call(function() { console.log("pcfranklin_full1.jpg loaded") }),
	call(function() { console.log("done") })
])()

var game1 = serial([
	call(function() { console.log("first") }),
	call(function() { console.log("second") }),
	call(function() { console.log("third") }),
	call(function() { console.log("fourth") }),
	call(function() { console.log("fifth") })
])()

var game2 = repeat(serial([
	nextFrame(),
	call(function() { console.log("frame") })
]))()

function Context(delta) {
	this.__delta = delta
	this.__changed = false
}

Context.prototype = {
	get delta() { return this.__delta },
	set delta(value) {
		this.__delta = value
		this.__changed = true
	}
}

var fin = false
run(function() {
	if(!fin) {
		//console.log("update")
		fin = game(new Context(timer.delta))
	}
})