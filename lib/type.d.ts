import type { P } from "./baseTask";
export interface INone {
    (e?: any): RNone;
}
export interface RNone {
    type: INone;
    join: () => any;
    map: () => RNone;
}
export interface ISome {
    <T>(x?: T): RSome<T extends RSome<infer U> ? U : T>;
}
export interface RSome<T> {
    type: ISome;
    join: () => T;
    map: <R>(fn: (x: T) => R) => RSome<R>;
}
export interface TaskArg<T> {
    (res: (x: T) => void, rej: (x: any) => void): void;
}
export interface TaskMap<X> {
    <R>(f: (x: X) => R): R extends P<infer U, RSome<infer U>> ? P<U, RSome<U>> : P<R, RSome<R>>;
}
