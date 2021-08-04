interface INone {
  (e?: any): RNone;
}
interface RNone {
  type: INone;
  join: () => any;
  map: (any?: any) => RNone;
}
interface ISome {
  <T>(x?: T): RSome<T extends RSome<infer U> ? U : T>;
}
interface RSome<T> {
  type: ISome;
  join: () => T;
  map: <R>(fn: (x: T) => R, g?: (x?: any) => R) => RSome<R>;
}
interface TaskArg<T> {
  (res: (x: T) => void, rej: (x: any) => void): void;
}
type Chain<T> = T extends P<infer U, RSome<infer U>> | Promise<infer U>
  ? P<U, RSome<U>>
  : P<T, RSome<T>>


interface TaskMap<X> {
  <R>(f: (x: X) => R, g?: (x?: any) => R): Chain<R>;
}


const isNone = (v: any) => !!v && v.type == None;
const isSome = (v: any) => !!v && v.type == Some;

const None: INone = (e): RNone => {
  if (isNone(e)) return e;
  if (isSome(e)) return None(e.join());
  const none = Object.freeze({
    type: None,
    join: () => e,
    map: () => none,
  });
  return none;
};

const Some: ISome = (x) => {
  if (isNone(x) || isSome(x)) return x as any;
  if (x == null || Object.is(x, NaN)) return None();
  return Object.freeze({
    type: Some,
    join: () => x,
    map: (f, g) => {
      try {
        return Some(f(x));
      } catch (e) {
        return g ? Some(e).map(g) : None(e);
      }
    },
  }) as any;
};
class P<X, T extends RSome<X>> extends Promise<T> {
  map: TaskMap<X> = (f, g) =>
    super
      .then((o: any) => ((o = o.map(f, g)), isSome(o) ? o.join() : o))
      .then(Some, None) as any;
}

const Task = <T>(f: TaskArg<T>): Chain<T> =>
  new P(f as any).then(Some, None) as any;
Task.resolve = <T>(x: T): Chain<T> => P.resolve(x) as any
Task.reject = <T>(x: T): P<T, RNone> => P.reject(x) as any

export { Task, None, Some, isNone, isSome };
