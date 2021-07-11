export interface INone {
    (e?: any): RNone;
}
export interface RNone {
    type: INone;
    join: () => any;
    map: () => RNone;
}
export interface ISome {
    <T>(x: T): RSome<T>;
}
export interface RSome<T> {
    type: ISome;
    join: () => T;
    map: <R>(fn: (x: T) => R) => RSome<R>;
}
export interface TaskArg<T> {
    (res: (x: T) => void, rej: (x: any) => void): void;
}
