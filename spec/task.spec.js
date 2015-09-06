describe("Task", function() {

	/*it("Delay should work", function() {
		var task = delay(30)();

		var context = { delta: 10 };
		task.next(context);
		var result = task.next(context);

		expect(context.delta).toBe(0);
		expect(result.done).toBeFalsy();

		context.delta = 30;
		result = task.next(context);

		expect(context.delta).toBe(10);
		expect(result.done).toBeTruthy();

		expect(false).toBeFalsy();
	});

	it("Repeat should work", function() {

		var calls = 0;
		var mock = function(func) {
			return function() {
				calls += 1;
				return func();
			}
		};

		var task = repeat(mock(delay(30)))();

		var context = { delta: 10 };
		task.next(context);
		var result = task.next(context);

		expect(context.delta).toBe(0);
		expect(result.done).toBeFalsy();
		expect(calls).toBe(1);

		context.delta = 30;
		result = task.next(context);

		expect(context.delta).toBe(0);
		expect(result.done).toBeFalsy();
		expect(calls).toBe(2);


	})*/

	function* q() {
		var output = 10;
		var input = yield output;
	}

});