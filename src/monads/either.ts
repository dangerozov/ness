import monads = require('../monads');

export let left = <T, U>(value: T): monads.Either<T, U> => {
    return { left: value, hasRight: false };
};

export let right = <T, U>(value: U): monads.Either<T, U> => {
    return { right: value, hasRight: true };
};

export let map = <T, U, V>(either: monads.Either<T, U>, map: (value: U) => V) => {
    return either.hasRight
        ? right<T, V>(map(either.right))
        : left<T, V>(either.left);
};

export let bind = <T, U, V>(either: monads.Either<T, U>, bind: (value: U) => monads.Either<T, V>) => {
    return either.hasRight
        ? bind(either.right)
        : left<T, V>(either.left);
};