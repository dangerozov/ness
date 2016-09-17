let array = {
    shift: (array) => {
        let previous = array[array.length - 1];
        for(let i = 0; i < array.length; i++) {
            let current = array[i];
            array[i] = previous;
            previous = current;
        }
        return array;
    },
    clear: (array) => {
        while(array.pop() != void 0);
    }
};

// SubscribeOnce<T> monad - event you can subscribe only once
// this is also Async<T> monad, because it has the same interface, i.e. returns result via callback
let task = {
    // multi-time events such as requestAnimationFrame, onmousemove, onkeypress have timeline like ---)(---[event]-)(----[event]-)(-----[event]-)(---
    // '(' - when you subscribed
    // '[event]' - when event was fired
    // ')' - when you can't subscribe to the same event again, because new event is approaching and you will subscribe to this next event instead
    // all system events is like Task, that you didn't started, unlike ajax calls
    // they're started in background by system every time event fires
    // so at any time there is a Task for upcoming event that you can subscribe to
    // and when this event fires, current Task became completed, notifying all subscribers, and then swapped with new Task, waiting for next event
    // at any time you have 'current' Task, that waits for upcoming event
    fromEvent: (subscribe) => {
        let subscribers = [[], []];
        subscribe((ev) => {
            array.shift(subscribers); array.clear(subscribers[0]);
            subscribers[1].forEach(callback => callback(ev));
        });
        return (callback) => subscribers[0].push(callback);
    },
    // one-time events such as window.onload have timeline like ---(---------[event--------------]---
    // can be subscribed any time before or after event
    // if you subscribe to it before event, it will put callback into queue and then call it when event fires
    // if you subscribe to it after event, it will call callback immediately (in the same callstack?), because it finished already
    // 'current' Task for one-time events isn't swapped with new one, because there is no upcomping events
    fromOneTimeEvent: (subscribe) => {
        let completed = false;
        let result = null;
        let subscribers = [];
        subscribe((ev) => {
            completed = true;
            result = ev;
            subscribers.forEach(callback => callback(ev));
        });
        return (callback) => completed ? callback(result) : subscribers.push(callback);
    },
    map: (subscribeOnce, selector) => {
        let subscribers = [];
        subscribeOnce(function on(args) {
            subscribeOnce(on);

            let mappedArgs = selector(args);

            let callbacks = subscribers; subscribers = [];
            callbacks.forEach(callback => callback(mappedArgs));
        });
        return (callback) => { subscribers.push(callback); };
    }
};

// using custom event
let onCustom;
let requestCustom = task.fromEvent(callback => onCustom = callback);

onCustom('custom 0'); // no subscribers, nobody will process event
requestCustom(console.log);
requestCustom(console.log);
onCustom('custom 1'); // two subscribers above will handle event only once
requestCustom(console.log);
onCustom('custom 2'); // one subscriber above will handle event only once

// RequestAnimationFrame is a built-in SubscribeOnce event
// that returns Elapsed time from the beggining of page load
// here we map/Select its result to return additional info
// previous - Elapsed time of previous requestAnimationFrame
// delta - time between current and previous frames
// if you (1 sec / delta) you will get FPS (frames per second) 
let raf = task.map(requestAnimationFrame, (() => {
    let time = {
        previous: 0,
        current: 0,
        delta: 0
    }

    return (elapsed) => {
        time.previous = time.current;
        time.current = elapsed;
        time.delta = time.current - time.previous;

        return time;
    };
})());

let delay = (delay) => {
    return (callback) => {
        let elapsed = 0;
        raf(function on(time) {
            elapsed += time.delta;
            if (elapsed >= delay) {
                callback(elapsed - delay);
                console.log('delay:finished', elapsed - delay);
            } else {
                raf(on);
            }
        })
    };
};

let repeat = (async) => (callback, token) => {
    async(function on(e) {
        if (!token.cancelled) async(on);
        else callback(e);
    });
};

// Async<T> monad - something that returns result via callback
let async = {
    // implementation of Promise.then/Task.ContinueWith
    bind: (subscribe, selector) => (callback) => {
        subscribe(r => selector(r)(r => callback(r)));
    }
};

// wait for window to load
let preload = task.fromOneTimeEvent(callback => window.onload = callback);
preload(console.log);

async.bind(preload, () => preload)(console.log);
async.bind(preload, () => preload)(console.log);
async.bind(preload, () => preload)(console.log);

let token = {
    cancelled: false
};
let game = async.bind(async.bind(
    delay(2000), // wait 2000 ms
    () => raf), // wait 1 frame
    () => raf); // wait another frame
game = ((gm) => (clb) => repeat(gm)(clb, token))(game);
game(r => console.log(r)); // game is Async<T> that we can subscribe to
