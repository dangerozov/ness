export interface Builder<TObject, TContext> {
	chain: (name: string, func: (context: TContext, ...args: any[]) => TContext) => Builder<TObject, TContext>;
	cascade: (name: string, func: (context: TContext, ...args: any[]) => void) => Builder<TObject, TContext>;
	unbox: <TValue>(name: string, func: (context: TContext, ...args: any[]) => TValue) => Builder<TObject, TContext>;
	value: (context: TContext) => TObject
}

let buildInternal = <TObject, TContext>() => {
	
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
		unbox: <TValue>(name: string, func: (context: TContext, ...args: any[]) => TValue) => {
			addToPrototype(name, function(...args) {
				return func((<Wrapper>this).value, ...args);
			});
			return builder;		
		}
	};

	return builder;
};

export let build = buildInternal;

interface Logger {
	log: (text: string) => Logger;
	logQ: (text: string) => Logger;
	logW: (text: string) => string;
}

let logger = build<Logger, number>()
	.chain("logQ", (num, text) => num + 5)
	.cascade("log", (num, text) => console.log(num, text))
	.unbox("logW", (num, text) => "hohoho")
	.value;

let s: string = logger(123)
	.logQ("qwe")
	.log("text")
	.logW("asd");
console.log(s);