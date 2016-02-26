export type Maybe<T> = { hasValue: boolean, value: T };

export let just = <T>(value: T) => {
    return { hasValue: true, value: value };
};

export let nothing = <T>() => {
    return { hasValue: false, value: <T>void 0 };
};

export let bind = <T1, T2>(maybe: Maybe<T1>, bind: (value: T1) => Maybe<T2>) => {
    let result: Maybe<T2>;
    if (maybe.hasValue) {
        result = bind(maybe.value);
    }
    else {
        result = nothing<T2>();
    }
    return result;
};