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

nessy.pipe = nessy.chain({
	pipe: (obj, func, ...args) => {
		return func.call(null, obj, ...args);
	}
});