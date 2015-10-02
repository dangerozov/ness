nessy.moco = function(host) {
	return {
		yield: function() {
			return function ctor() {
				return function update() {
					return true;
				};
			};
		},
		
		nextFrame: function() {
			return function ctor() {
				var finished = false;
				return function update() {
					return finished || !(finished = true);
				};
			};
		},
		
		call(func) {
			return function ctor() {
				return function update() {
					func();
					return true;
				};
			};
		},
		
		loadImage(path, callback) {
			return function ctor() {
				var image = new Image();
				image.loaded = false;
				image.onload = function() {
					this.loaded = true;
				};
				image.src = path;
		
				return function update() {
					var finished = image.loaded;
					if (finished && callback !== undefined) callback(image);
					return finished;
				};
			};
		},
		
		delay(time) {
			return function ctor() {
				var elapsed = 0;
		
				return function update() {
					elapsed += host.timer.delta;
					return elapsed >= time;
				};
			};
		},
		
		run(update) {
			var __update = function(elapsedTotal) {
				window.requestAnimationFrame(__update);
					timer.update(elapsedTotal);
					update();
			};
			window.requestAnimationFrame(__update);
		},
		
		serial: function(taskCtors) {
			return function ctor() {
				var e = this.getEnumerator(taskCtors);
				var current = e.next();
				var task = (current.done ? yield() : current.value()).bind(this);
				task.finished = false;
				
				return function update() {
		
					while (
						!task.finished &&
						(task.finished = task()) &&
						!current.done &&
						!(current = e.next()).done) 
					{
						task = current.value().bind(this);
						task.finished = false;
					}
		
					return task.finished;
				}.bind(this);
			};
		},
		
		parallel(taskCtors) {
			return () => {
				var e = this.getEnumerator(taskCtors);
				var current = e.next();
				var tasks;
				return function update() {
		
				};
			};
		},
		
		repeat(taskCtor) {
			return function ctor() {
				var task = taskCtor();
				task.finished = false;
				return function update() {
		
					while(!task.finished && (task.finished = task())) {
						task = taskCtor();
						task.finished = false;
					}
		
					return false;
				};
			};
		},
		
		getEnumerator: function* (array) {
			for (var i = 0; i < array.length; i++) {
				yield array[i];
			}
		}
	};
};