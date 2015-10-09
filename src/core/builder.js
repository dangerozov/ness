nessy.builder = (() => {
	var chain = (wrapped, name, func) => {
		wrapped[name] = (...args) => {
			wrapped.value = func(wrapped.value, ...args);
			return wrapped;
		};
	};
	
	var cascade = (wrapped, name, func) => {
		wrapped[name] = (...args) => {
			func(wrapped.value, ...args);
			return wrapped;
		};
	};
	
	var unbox = (wrapped, name, func) => {
		wrapped[name] = (...args) => {
			return func(wrapped.value, ...args);
		};
	};
	
	return () => {
		var builder = {
			value: obj => {
				var wrapped = { value: obj };
				builder.value.funcs.forEach(func => func(wrapped));
				return wrapped;
			}
		};
		builder.value.funcs = [];
	
		cascade(builder, "chain", (value, name, func) => {
			value.funcs.push(wrapped => chain(wrapped, name, func));
		});
		cascade(builder, "cascade", (value, name, func) => {
			value.funcs.push(wrapped => cascade(wrapped, name, func));
		});
		cascade(builder, "unbox", (value, name, func) => {
			value.funcs.push(wrapped => unbox(wrapped, name, func));
		});
	
		return builder;
	};
})();

var logger = nessy.builder()
	.cascade("log", (log, text) => log(text))
	.cascade("logError", (log, text) => log("Error: " + text))
	.cascade("logInfo", (log, text) => log("Info: " + text))
	.value;

logger(console.log.bind(console))
	.log("pam pam")
	.logError("PAM PAM !!!")
	.logInfo("informational pam");