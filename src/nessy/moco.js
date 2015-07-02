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
		image.loaded = function() {
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
	var skip = 0
	var __update = function(elapsedTotal) {
		window.requestAnimationFrame(__update)
		if (skip < 100) {
			skip++
		}
		else {
			timer.update(elapsedTotal)
			update()
			skip = 0
		}
	}
	window.requestAnimationFrame(__update)
}

function serial(tasks) {
	return function ctor() {
		var e = getEnumerator(tasks)
		var current = e.next()
		var task = current.done ? yield() : current.value()
		var finished = false
		return function update() {
			if (!finished) {
				finished = task()
				return false
			}

			if (!current.done && !(current = e.next()).done) {
				task = current.value()
				finished = task()
			}

			return true
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

var game = serial([
	call(function() { console.log("first") }),
	call(function() { console.log("second") }),
	call(function() { console.log("third") }),
	call(function() { console.log("fourth") }),
	call(function() { console.log("fifth") })
])()

run(game)