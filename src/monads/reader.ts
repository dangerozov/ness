import monads = require('../monads');

export let run = <T, U>(reader: monads.Reader<T, U>, args: T) => {
    return reader(args);
};

export let _return = <T, U>(value: U): monads.Reader<T, U> => 
    (args: T) => {
        return value;
    };

export let map = <T, U, V>(reader: monads.Reader<T, U>, map: (item: U) => V) => {
    let result: monads.Reader<T, V> = (args: T) => {
        return map(run(reader, args));
    };
    return result;
};

export let bind = <T, U, V>(reader: monads.Reader<T, U>, bind: (item: U) => monads.Reader<T, V>) => {
    let result: monads.Reader<T, V> = (args: T) => {
        return run(bind(run(reader, args)), args);  
    };
    return result;
};