nessy.chain = (() => {
	var createChained = (func) => {
		return chained => {
			return (...args) => {
				chained.value = func(chained.value, ...args);
				return chained;
			};
		};
	};
	
	var chainFuncs = funcs => {
		var result = {};	
		
		for (var funcName in funcs) {
			var func = funcs[funcName];
			if (func instanceof Function) {
				result[funcName] = createChained(func);
			}
		}
		
		return result;
	};
	
	return funcs => {
		var chainedFuncs = chainFuncs(funcs);
		return obj => {
			var chained = {
				value: obj
			};
			
			for (var funcName in chainedFuncs) {
				var func = chainedFuncs[funcName];
				chained[funcName] = func(chained);
			}
			
			return chained;
		};
	};
})();


/*var <your chaining object> = function(collection) {
    return {
        <chained function>: function(<any fields for it>) {
            return <your chaining object>(<result of custom function>);
        },...
        value: function() {
            return collection;
        }
    };
};*/

var copy = (left, right) => {
	for (var name in right) {
		left[name] = right[name];
	}
};

var addChained = (wrapped, name, func) => {
	wrapped[name] = (...args) => {
		wrapped.value = func(wrapped.value, ...args);
		return wrapped;
	};
};

var addCascaded = (wrapped, name, func) => {
	wrapped[name] = (...args) => {
		func(wrapped.value, ...args);
		return wrapped;
	};
};

var wrap = { value: { } };
addCascaded(wrap, "addCascaded", addCascaded);
addChained(wrap, "addChained", addChained);

var build = () => {
			var builder = {
				funcs: [],
				value: obj => {
					var wrapped = { value: obj };
					builder.funcs.forEach(func => func(wrapped));
					return wrapped;
				},
				chain: (name, func) => {
					builder.funcs.push(wrapped => {
						wrapped[name] = (...args) => {
							wrapped.value = func(wrapped.value, ...args);
							return wrapped;
						};
					});
					return builder;
				},
				cascade: (name, func) => {
					builder.funcs.push(wrapped =>  {
						wrapped[name] = (...args) => {
							func(wrapped.value, ...args);
							return wrapped;
						};
					});
					return builder;
				},
				unbox: (name, func) => {
					builder.funcs.push(wrapped => {
						wrapped[name] = (...args) => {
							return func(wrapped.value, ...args);
						};
					});
					return builder;
				}
			};
			return builder;
		};
		
		var logger = build()
			.cascade("log", (log, text) => log(text))
			.cascade("logError", (log, text) => log("Error: " + text))
			.cascade("logInfo", (log, text) => log("Info: " + text))
			.value;
		
		logger(console.log.bind(console))
			.log("pam pam")
			.logError("PAM PAM !!!")
			.logInfo("informational pam");

nessy.chainFunc = (name, func) => {
	return obj => {
		var chained = wrap(obj);
		add(chained, name, func);
		add(chained, name + "2", func);
		
		return chained;
	};
};

var objToArray = (obj, names) => names.map(name => obj[name]);
var spreadArray = (args, func) => {
	func(...args);
};

var fillRect = (x, y, width, height) => console.log(x, y, width, height);

var obj = (obj) => {
	var wrapped = {
		value: obj,
		pluck: (names) => names.map(name => wrapped.value[name])
	};
	
	return wrapped;
};

var func = (func) => {
	var wrapped = {
		value: func,
		spread: (args) =>
			wrapped.value(...args)
	};
	
	return wrapped;
};

var old = fillRect;
fillRect = (rect) => {
	var args = obj(rect).pluck(["x", "y", "width", "height"]);
	var result = func(old).spread(args);
	return result; 
};

// var old = fillRect;
// fillRect = (rect) => old(rect.x, rect.y, rect.width, rect.height);

// this.context.fillRect(rect.x, rect.y, rect.width, rect.height);



nessy.pipe = nessy.chain({
	pipe: (obj, func, ...args) => {
		return func.call(null, obj, ...args);
	}
});