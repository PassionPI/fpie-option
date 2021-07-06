interface INone {
    (e?: any): RNone;
}
interface RNone {
    type: INone;
    join: () => any;
    map: () => RNone;
}
interface ISome {
    <T>(x: T): RSome<T>;
}
interface RSome<T> {
    type: ISome;
    join: () => T;
    map: <R>(fn: (x: T) => R) => RSome<R>;
}
interface TaskArg<T> {
    (res: (x: T) => void, rej: (x: any) => void): void;
}
declare const isNone: (v: any) => boolean;
declare const isSome: (v: any) => boolean;
declare const None: INone;
declare const Some: ISome;
declare class TaskClass<X, T extends RSome<X>> extends Promise<T> {
    map: <R>(fn: (x: X) => R) => TaskClass<R, RSome<R>>;
}
declare const Task: <T>(fn: TaskArg<T>) => TaskClass<T, RSome<T>>;
export { Task, None, Some, isNone, isSome };
