import monads = require('../monads');

export let just = <T>(value: T): monads.Maybe<T> => {
    return { hasValue: true, value: value };
};

export let nothing = <T>(): monads.Maybe<T> => {
    return { hasValue: false, value: <T>void 0 };
};

export let _return = just;
export let returnIf = <T>(hasValue: boolean, value: T) => hasValue
    ? just(value)
    : nothing<T>();

export let map = <T, U>(maybe: monads.Maybe<T>, map: (value: T) => U) => {
    return maybe.hasValue
        ? just(map(maybe.value))
        : nothing<U>();
};

export let amap = <T, U>(maybe: monads.Maybe<T>, amap: monads.Maybe<(value: T) => U>) => {
    return amap.hasValue
        ? map(maybe, amap.value)
        : nothing<U>();
};

export let bind = <T, U>(maybe: monads.Maybe<T>, bind: (value: T) => monads.Maybe<U>) => {
    return maybe.hasValue
        ? bind(maybe.value)
        : nothing<U>();
};