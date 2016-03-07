type Maybe<T> = { hasValue: boolean, value: T };

export let just = <T>(value: T) => {
    return { hasValue: true, value: value };
};

export let nothing = <T>() => {
    return { hasValue: false, value: <T>void 0 };
};

export let _return = just;

export let map = <T, U>(maybe: Maybe<T>, map: (value: T) => U) => {
    return maybe.hasValue
        ? just(map(maybe.value))
        : nothing<U>();
};

export let amap = <T, U>(maybe: Maybe<T>, amap: Maybe<(value: T) => U>) => {
    return amap.hasValue
        ? map(maybe, amap.value)
        : nothing<U>();
};

export let bind = <T, U>(maybe: Maybe<T>, bind: (value: T) => Maybe<U>) => {
    return maybe.hasValue
        ? bind(maybe.value)
        : nothing<U>();
};