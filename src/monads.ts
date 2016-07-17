export interface Either<T, U> { left?: T, right?: U, hasRight: boolean };
export interface Maybe<T> { hasValue: boolean, value: T };
export interface Reader<T, U> { (args: T): U };
