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

function delay(time) {
	return function ctor() {
		var elapsed = 0

		return function update() {
			elapsed += nessy.timer.delta
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