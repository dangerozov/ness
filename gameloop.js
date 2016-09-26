let noop = (_) => _;
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

let eventSource = {
    range: (start, count) => {
        let result = eventSource.create();
        setTimeout(() => result.send(1), 0);
        return result;
    },
    create: () => {
        let event = {
            subs: [],
            sub: function (cb) { return this.subs.push(cb); },
            unsub: function (id) { this.subs.splice(id - 1, 1); },
            subOnces: [[],[]],
            subOnce: function(cb) { return this.subOnces[0].push(cb); },
            send: function (ev) {
                let call = cb => cb(ev);
                if (this.subs === void 0) {
                    console.log(this);
                }
                this.subs.forEach(call);

                array.shift(this.subOnces); array.clear(this.subOnces[0]);
                this.subOnces[1].forEach(call);
            }
        };

        return event;
    },
    fromSubscribeOnce: (subscribeOnce) => {
        let result = eventSource.create();
        subscribeOnce(function on(ev) {
            subscribeOnce(on);
            result.send(ev);
        });
        return result;
    },
    map: (source, selector) => {
        let result = eventSource.create();
        source.sub(ev => result.send(selector(ev)));
        return result;
    },
    bind: (source, selector) => {
        let result = eventSource.create();
        source.sub(ev => {
            let evSrc = selector(ev);
            evSrc.sub(ev => result.send(ev));
        });
        return result;
    }
};

let cstm = eventSource.create();
let cstm2 = eventSource.bind(cstm, ev => eventSource.create());
cstm2.sub(console.log);
cstm.send('qwe');

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
        return (callback) => completed
            ? setTimeout(callback, 0, result)
            : subscribers.push(callback);
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

let raf = eventSource.map(eventSource.fromSubscribeOnce(requestAnimationFrame), (() => {
    let time = {
        previous: 0,
        current: 0,
        delta: 0
    };

    return (elapsed) => {
        time.previous = time.current;
        time.current = elapsed;
        time.delta = time.current - time.previous;

        return time;
    };
})());

let time = eventSource.map(raf, ev => ev.delta);

let delay = (ms) => {    
    let completedEventSource = eventSource.create();

    let elapsed = 0;    
    time.subOnce(function on(delta) {
        //console.log('upd', delta);
        elapsed += delta;
        if (elapsed >= ms) {
            setTimeout(() => time.send(elapsed - ms), 0, time);
            console.log('finished', elapsed - ms);
            completedEventSource.send();
        } else {
            time.subOnce(on);
        }
    });
    
    return completedEventSource;
};

let repeat = (createTask) => {

    let task = createTask();
    task(function on() {
        task = createTask();
        task(on);
    });

    return noop;
};

let w2000 = delay(2000);
w2000.sub(() => console.log('2000'));
w2000.sub(() => console.log('2000'));
w2000.sub(() => console.log('2000'));

// wait for window to load
let preload = eventSource.create();
window.onload = (ev) => preload.send(ev);
preload.sub(console.log);

eventSource.bind(preload, () => preload).sub(console.log);
eventSource.bind(preload, () => preload).sub(console.log);
eventSource.bind(preload, () => preload).sub(console.log);

let token = {
    cancelled: false
};

/*let game = async.bind(async.bind(
    delay(2000), // wait 2000 ms
    () => raf), // wait 1 frame
    () => raf); // wait another frame
game = ((gm) => (clb) => repeat(gm)(clb, token))(game);*/
//game(r => console.log(r)); // game is Async<T> that we can subscribe to

//repeat(() => delay(1));
