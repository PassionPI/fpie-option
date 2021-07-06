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

const isNil = (v: any) => v == null || Object.is(v, NaN);
const isNone = (v: any) => v?.type === None;
const isSome = (v: any) => v?.type === Some;
const isOption = (v: any) => isNone(v) || isSome(v);

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
  if (isOption(x)) return x as any;
  if (isNil(x)) return None();
  const some: RSome<T> = {
    type: Some,
    join: () => x,
    map: (fn) => {
      try {
        return Some(fn(x));
      } catch (e) {
        return None(e);
      }
    },
  };
  return some;
};

class TaskClass<X, T extends RSome<X>> extends Promise<T> {
  map = <R>(fn: (x: X) => R): TaskClass<R, RSome<R>> =>
    super
      .then((v) => (isSome(v) ? (v as any).map(fn) : v))
      .then(Some, None) as any;
}

const Task = <T>(fn: TaskArg<T>): TaskClass<T, RSome<T>> =>
  new TaskClass(fn as any).then(Some, None) as any;

export { Task, None, Some, isNone, isSome };
