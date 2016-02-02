type Builder<TObject, TContext> = {
	chain: (name: string, func: (context: TContext, ...args: any[]) => TContext) => Builder<TObject, TContext>;
	cascade: (name: string, func: (context: TContext, ...args: any[]) => void) => Builder<TObject, TContext>;
	unbox: (name: string, func: (context: TContext, ...args: any[]) => any) => Builder<TObject, TContext>;
	value: (context: TContext) => TObject
}

export let build = <TObject, TContext>() => {
	
	class Wrapper {
		public value: TContext;
		constructor(context: TContext) {
			this.value = context;
		}
	}
	
	let addToPrototype = (name: string, func: (...args: any[]) => Wrapper | any) => {
		(<{ [key: string]: any }>Wrapper.prototype)[name] = func;
	};
	
	let builder: Builder<TObject, TContext>;

	builder = {
		value: (context) => <Wrapper & TObject>new Wrapper(context),
		chain: (name, func) => {
			addToPrototype(name, function(...args) {
				(<Wrapper>this).value = func((<Wrapper>this).value, ...args);
				return <Wrapper>this;
			});
			return builder;
		},
		cascade: (name, func) => {
			addToPrototype(name, function(...args) {
				func((<Wrapper>this).value, ...args);
				return <Wrapper>this;
			});
			return builder;
		},
		unbox: (name, func) => {
			addToPrototype(name, function(...args) {
				return func((<Wrapper>this).value, ...args);
			});
			return builder;		
		}
	};

	return builder;
};

type Logger = {
	log: (text: string) => Logger;
	logError: (text: string) => Logger;
	logInfo: (text: string) => Logger;
}

console.log("===== builder =====");
var logger = build<Logger, (message: string) => void>()
	.cascade("log", (log, text) => log(text))
	.cascade("logError", (log, text) => log("Error: " + text))
	.cascade("logInfo", (log, text) => log("Info: " + text))
	.value;

logger(console.log.bind(console))
	.log("pam pam")
	.logError("PAM PAM !!!")
	.logInfo("informational pam");