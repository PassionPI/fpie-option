interface Err {
  join: () => any;
  map: (any?: any) => Err;
}
interface Ok<T> {
  join: () => T;
  map: <R>(f: (x: T) => R, g?: (x?: any) => any) => ChainOk<R>;
}

type ChainOk<T> = T extends Ok<infer U> ? Ok<U> : Ok<T>

type ChainP<T> = T extends P<infer U, Ok<infer U>> | Promise<infer U>
  ? P<U, Ok<U>>
  : P<T, Ok<T>>

type Step<T> = P<T, Ok<T>>

const TYPE = Symbol();
const ERR = Symbol('err');
const OK = Symbol('ok');

const isErr = (v: any) => !!v && v[TYPE] == ERR;
const isOk = (v: any) => !!v && v[TYPE] == OK;

const err = (e?: unknown): Err => {
  if (isErr(e)) return e as Err;
  if (isOk(e)) return err((e as Ok<unknown>).join());
  const _err = Object.create(null) as Err;
  _err[TYPE] = ERR;
  _err.join = () => e;
  _err.map = () => _err;
  return _err;
};

const ok = <T>(x?: T): ChainOk<T> => {
  if (isErr(x) || isOk(x)) return x as any;
  const _ok = Object.create(null) as any;
  _ok[TYPE] = OK;
  _ok.join = () => x;
  _ok.map = (f, g) => {
    try {
      return ok(f(x));
    } catch (e) {
      return g ? ok(e).map(g) : err(e);
    }
  }
  return _ok;
}

class P<X, T extends Ok<X>> extends Promise<T> {
  map = <R>(f: (x: X) => R, g?: (x?: any) => any): ChainP<R> =>
    super
      .then(o => o.map(f, g))
      .then(o => isOk(o) ? o.join() : o)
      .then(ok, err) as any;
}

const step = <T>(f: (res: (x: T) => void, rej: (x: any) => void) => void): ChainP<T> =>
  new P(f as any).then(ok, err) as any;

step.resolve = <T>(x: T): ChainP<T> => P.resolve(x).then(ok) as any;
step.reject = <T>(x: T): ChainP<T> => P.reject(x).catch(err) as any;

export { step, err, ok, isErr, isOk, Ok, Err, Step };
