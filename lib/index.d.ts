import type { INone, ISome, RSome, TaskArg } from "./type";
declare const isNone: (v: any) => boolean;
declare const isSome: (v: any) => boolean;
declare const None: INone;
declare const Some: ISome;
interface TaskMap<X> {
    <R>(f: (x: X) => R): R extends P<infer U, RSome<infer U>> ? P<U, RSome<U>> : P<R, RSome<R>>;
}
declare class P<X, T extends RSome<X>> extends Promise<T> {
    map: TaskMap<X>;
}
declare const Task: <T>(f: TaskArg<T>) => P<T, RSome<T>>;
export { Task, None, Some, isNone, isSome };
