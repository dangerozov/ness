// SubscribeOnce<T> monad - event you can subscribe only once
// this is also Async<T> monad, because it has the same interface, i.e. returns result via callback 
let subscribeOnce = {
    create: (subscribe) => {
        let subscribers = [];
        subscribe((...args) => {
            let callbacks = subscribers; subscribers = [];
            callbacks.forEach(callback => callback(...args));
        });
        return (callback) => { subscribers.push(callback) };
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
let requestCustom = subscribeOnce.create(callback => onCustom = callback);

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
let raf = subscribeOnce.map(requestAnimationFrame, (() => {
    let previous = 0;
    let current = 0;
    let delta = 0;

    return (elapsed) => {
        previous = current;
        current = elapsed;
        delta = current - previous;

        return [current, previous, delta];
    };
})());

// Async<T> monad - something that returns result via callback
let async = {
    // implementation of Promise.then/Task.ContinueWith
    bind: (subscribe, selector) => (callback) => {
        subscribe(r => selector(r)(r => callback(r)));
    }
};

let game = async.bind(async.bind(async.bind(
    (callback) => window.onload = callback, // wait for window to load
    () => (callback) => setTimeout(callback, 2000)), // wait 2000 ms
    () => raf), // wait 1 frame
    () => raf); // wait another frame

game(r => console.log(r)); // game is Async<T> that we can subscribe to
