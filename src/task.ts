type Task<T> = {
	(state: T): State;
}

type State = {
	done: boolean;
	next: (input: any) => any;
}

let nothing: <T>(input: T) => T = input => input;

export let Yield: Task<any> = () => {
	return {
		done: true,
		next: nothing
	}
};

export let Next: Task<any> = () => {
	let state: State;
	state = {
		done: false,
		next: input => {
			state.done = true;
			return input;
		}
	};
	return state;
}

export let Invoke: Task<{ (): void }> = func => {
	let state: State;
	state = {
		done: false,
		next: input => {
			func();
			state.done = true;
			return input;
		}
	};
	return state;
};

export let Callback: Task<{ (callback: () => void): void }> = subscribe => {
	let state: State;
	state = {
		done: false,
		next: nothing
	};
	subscribe(() => state.done = true);
	return state;
};

export let LoadImage: Task<string> = path => {
	let image = new Image();
	return Callback(callback => image.onload = callback);
};

export let Delay: Task<number> = time => {
	let elapsed = 0;
	
	let state: State;
	state = {
		done: false,
		next: (input: number) => {
			elapsed += input;
			state.done = elapsed >= time;
			return Math.max(elapsed - time, 0);
		}
	};
	return state;	
};