interface IErr {
  (e?: any): RErr;
}
interface RErr {
  type: IErr;
  join: () => any;
  map: (any?: any) => RErr;
}
interface IOk {
  <T>(x?: T): ROk<T extends ROk<infer U> ? U : T>;
}
interface ROk<T> {
  type: IOk;
  join: () => T;
  map: <R>(f: (x: T) => R, g?: (x?: any) => R) => ROk<R>;
}
interface StepArg<T> {
  (res: (x: T) => void, rej: (x: any) => void): void;
}

interface StepMap<X> {
  <R>(f: (x: X) => R, g?: (x?: any) => R): R extends P<infer U, ROk<infer U>>
    ? P<U, ROk<U>>
    : P<R, ROk<R>>;
}


const isErr = (v: any) => !!v && v.type == Err;
const isOk = (v: any) => !!v && v.type == Ok;

const Err: IErr = (e): RErr => {
  if (isErr(e)) return e;
  if (isOk(e)) return Err(e.join());
  const err = Object.freeze({
    type: Err,
    join: () => e,
    map: () => err,
  });
  return err;
};

const Ok: IOk = (x) => {
  if (isErr(x) || isOk(x)) return x as any;
  return Object.freeze({
    type: Ok,
    join: () => x,
    map: (f, g) => {
      try {
        return Ok(f(x));
      } catch (e) {
        return typeof g === 'function' ? Ok(e).map(g) : Err(e);
      }
    },
  }) as any;
};
class P<X, T extends ROk<X>> extends Promise<T> {
  map: StepMap<X> = (f, g) =>
    super
      .then((o: any) => ((o = o.map(f, g)), isOk(o) ? o.join() : o))
      .then(Ok, Err) as any;
}

const Step = <T>(f: StepArg<T>): P<T, ROk<T>> =>
  new P(f as any).then(Ok, Err) as any;

export { Step, Err, Ok, isErr, isOk };
