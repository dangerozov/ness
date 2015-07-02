var timer = {
	previous: 0,
	delta: 0,
	update: function(elapsedTotal) {
		timer.delta = (elapsedTotal - timer.previous) / 1000
		timer.previous = elapsedTotal	
	}
}

function loadImage(path) {
	var image = new Image()
	image.loaded = false
	image.onload = function() {
		this.loaded = true
	}
	image.src = path
	return function() {
		return image.loaded
	}
}

function wait(time) {
	var elapsed = 0
	return function() {
		elapsed += timer.delta
		return elapsed >= time
	}
}

function call(func) {
	return function() {
		func()
		return true
	}
}

function run(update) {
	var __update = function(elapsedTotal) {
		window.requestAnimationFrame(__update)
		timer.update(elapsedTotal)
		update()
	}
	window.requestAnimationFrame(__update)
}

function serial(tasks) {
	return aggregate(tasks, serialTwo)
}

function serialTwo(first, second) {
	var firstFinished = false
	var secondFinished = false
	return function() {
		if (!firstFinished) {
			firstFinished = first()
			return false
		}
		if (!secondFinished) {
			secondFinished = second()
			return false
		}
		return true
	}
}

function aggregate(array, func) {
	var first = array[0]
	for (var i = 1; i < array.length; i++) {
		second = array[i]
		first = func(first, second)
	}
	return first
}

function singleSeconds(count) {
	var array = []
	for (var i = count - 1; i >= 0; i--) {
		(function() {
			var str = i + "/" + count + " sec"
			array.push(call(function() { console.log(str) }))
			array.push(wait(0.01))
		})()
	}
	return serial(array)
}

var game = serial([
	singleSeconds(10000),
	loadImage("motivation.png"),
	call(function() { console.log("motivation.png loaded") }),
	call(function() { console.log("3 sec") }),
	wait(1),
	call(function() { console.log("2 sec") }),
	wait(1),
	call(function() { console.log("1 sec") }),
	wait(1),	
	loadImage("proskater.png"),
	call(function() { console.log("proskater.png loaded") }),
	call(function() { console.log("done") })
])

run(game)