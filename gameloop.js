
let map = (subscribe, selector) => (callback) => {
    subscribe(r => callback(selector(r)));
};

let filter = (predicate, subscribe) => (callback) => {
    subscribe(r => {
        if (predicate(r)) callback(r);
    });
};

let bind = (subscribe, selector) => (callback) => {
    subscribe(r => selector(r)(r => callback(r)));
};

let eventToRequest = ((subscribe) => {
    let fired = false;
    let subscribers = [];
    subscribe(() => {
        fired = true;
        subscribers.forEach(callback => callback());
        while(subscribers.pop() !== void 0);
    });

    return (callback) => {
        if (fired) callback();
        else subscribers.push(callback);
    }
});

let requestOnLoad = eventToRequest(callback => window.onload = callback);

requestAnimationFrame = ((raf) => (callback) => {
    raf(elapsed => {
        console.log('raf', elapsed);
        callback(elapsed);
    });
})(requestAnimationFrame);

let raf = ((previous) => {
    console.log('raf:delta', previous);
    return map(requestAnimationFrame, 
        current => current - previous);
});

let timeout = callback => setTimeout(callback, 2000);

let game = bind(bind(bind(
    requestOnLoad,
    () => timeout), 
    () => raf(performance.now())),
    () => raf(performance.now()));

game(r => console.log(r));
