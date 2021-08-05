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
  map: <R>(f: (x: T) => R, g?: (x?: any) => any) => ROk<R>;
}
interface StepArg<T> {
  (res: (x: T) => void, rej: (x: any) => void): void;
}

type Chain<T> = T extends P<infer U, ROk<infer U>> | Promise<infer U>
  ? P<U, ROk<U>>
  : P<T, ROk<T>>

interface StepMap<X> {
  <R>(f: (x: X) => R, g?: (x?: any) => any): Chain<R>;
}


const isErr = (v: any) => !!v && v.type == Err;
const isOk = (v: any) => !!v && v.type == Ok;

const Err: IErr = (e): RErr => {
  if (isErr(e)) return e;
  if (isOk(e)) return Err(e.join());
  const err = {
    type: Err,
    join: () => e,
    map: () => err,
  };
  return err;
};

const Ok: IOk = (x) => {
  if (isErr(x) || isOk(x)) return x as any;
  return {
    type: Ok,
    join: () => x,
    map: (f, g) => {
      try {
        return Ok(f(x));
      } catch (e) {
        return g ? Ok(e).map(g) : Err(e);
      }
    },
  } as any;
};
class P<X, T extends ROk<X>> extends Promise<T> {
  map: StepMap<X> = (f, g) =>
    super
      .then(o => o.map(f, g))
      .then(o => isOk(o) ? o.join() : o)
      .then(Ok, Err) as any;
}

const Step = <T>(f: StepArg<T>): Chain<T> =>
  new P(f as any).then(Ok, Err) as any;
Step.resolve = <T>(x: T): Chain<T> => P.resolve(x) as any
Step.reject = <T>(x: T): P<T, RErr> => P.reject(x) as any

export { Step, Err, Ok, isErr, isOk };
