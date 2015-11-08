nessy.builder = (() => {
	return () => {
		var wrapper = function(obj) {
			this.value = obj;
		};

		var builder = {
			value: (obj) => new wrapper(obj)
		};

		builder.chain = (name, func) => {
			wrapper.prototype[name] = function(...args) {
				this.value = func(this.value, ...args);
				return this;
			};
			return builder;
		};

		builder.cascade = (name, func) => {
			wrapper.prototype[name] = function(...args) {
				func(this.value, ...args);
				return this;
			};
			return builder;
		};

		builder.unbox = (name, func) => {
			wrapper.prototype[name] = function(...args) {
				return func(this.value, ...args);
			};
			return builder;
		};

		return builder;
	};
})();

console.log("===== builder =====");
var logger = nessy.builder()
	.cascade("log", (log, text) => log(text))
	.cascade("logError", (log, text) => log("Error: " + text))
	.cascade("logInfo", (log, text) => log("Info: " + text))
	.value;

logger(console.log.bind(console))
	.log("pam pam")
	.logError("PAM PAM !!!")
	.logInfo("informational pam");