const isNil = (v) => v == null || Object.is(v, NaN);
const isNone = (v) => v?.type === None;
const isSome = (v) => v?.type === Some;
const isOption = (v) => isNone(v) || isSome(v);

const None = (e) => {
  if (isNone(e)) return e;
  if (isSome(e)) return None(e.join());
  const none = {
    type: None,
    join: () => e,
    map: () => none,
  };
  return none;
};

const Some = (x) => {
  if (isOption(x)) return x;
  if (isNil(x)) return None();
  const some = {
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

class T extends Promise {
  map = (fn) => super.then((v) => (isNone(v) ? v : v.map(fn))).then(Some, None);
}

const Task = (fn) => new T(fn).then(Some, None);

export { Task, None, Some, isNone, isSome };
