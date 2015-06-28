function delay(time) {
	return function*() {
		var elapsed = 0
		while (true) {
			var context = yield

			elapsed += context.delta
			context.delta = 0
			if (elapsed >= time) {
				context.delta = elapsed - time
				break
			}
		}
	}
}

function func(func) {
	return function*() {
		func()
	}
}

function serial(createLeft, createRight) {
	return function*() {
		var left = createLeft()
		var right = createRight()
		while (true) {
			var context = yield

			var result
			do {
				result = left.next(context)
			}
			while(!result.done && context.delta > 0)

			if (result.done) {
				do {
					result = right.next(context)
				}
				while(!result.done && context.delta > 0)
			}

			if (result.done) {
				break;
			}
		}
	}
}

function repeat(createTask) {
	return function*() {
		var task = createTask()
		while(true) {
			var context = yield

			do {
				var result
				do {
					result = task.next(context)
				}
				while(!result.done && context.delta > 0)

				if (result.done) {
					task = createTask()
				}
			}
			while(context.delta > 0)
		}
	}
}