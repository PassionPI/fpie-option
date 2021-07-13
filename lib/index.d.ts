import { P } from "./baseTask";
import type { INone, ISome, RSome, TaskArg } from "./type";
declare const isNone: (v: any) => boolean;
declare const isSome: (v: any) => boolean;
declare const None: INone;
declare const Some: ISome;
declare const Task: <T>(f: TaskArg<T>) => P<T, RSome<T>>;
export { Task, None, Some, isNone, isSome };
