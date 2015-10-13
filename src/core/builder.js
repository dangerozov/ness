var cascade = (func, context) => {
	return (...args) => {
		func(...args);
		return context;
	};
};

nessy.builder = (() => {
	var cascadeThis = (func) => function(...args) {
		func.call(this, ...args);
		return this;
	};

	return () => {
		var wrapper = function(obj) {
			this.value = obj;
		};

		var builder = {
			value: (obj) => new wrapper(obj)
		};

		builder.chain = cascade((name, func) => {
			wrapper.prototype[name] = cascadeThis(function(...args) {
				this.value = func(this.value, ...args);
			});
		}, builder);

		builder.cascade = cascade((name, func) => {
			wrapper.prototype[name] = cascadeThis(function(...args) {
				func(this.value, ...args);
			});
		}, builder);

		builder.unbox = cascade((name, func) => {
			wrapper.prototype[name] = function(...args) {
				return func(this.value, ...args);
			};
		}, builder);

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