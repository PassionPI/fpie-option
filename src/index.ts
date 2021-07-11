import type { INone, ISome, RNone, RSome, TaskArg } from "./type";

const isNone = (v: any) => v?.type == None;
const isSome = (v: any) => v?.type == Some;

const None: INone = (e): RNone => {
  if (isNone(e)) return e;
  if (isSome(e)) return None(e.join());
  const none = {
    type: None,
    join: () => e,
    map: () => none,
  };
  return none;
};

const Some: ISome = <T>(x: T): RSome<T> => {
  if (isNone(x) || isSome(x)) return x as any;
  if (x == null || Object.is(x, NaN)) return None();
  return {
    type: Some,
    join: () => x,
    map: (f) => {
      try {
        return Some(f(x));
      } catch (e) {
        return None(e);
      }
    },
  };
};

class P<X, T extends RSome<X>> extends Promise<T> {
  map = <R>(f: (x: X) => R): P<R, RSome<R>> =>
    super
      .then((o: any) => ((o = o.map(f)), isSome(o) ? o.join() : o))
      .then(Some, None) as any;
}

const Task = <T>(f: TaskArg<T>): P<T, RSome<T>> =>
  new P(f as any).then(Some, None) as any;

export { Task, None, Some, isNone, isSome };
