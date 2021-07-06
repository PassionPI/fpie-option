"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSome = exports.isNone = exports.Some = exports.None = exports.Task = void 0;
const isNil = (v) => v == null || Object.is(v, NaN);
const isNone = (v) => v?.type === None;
exports.isNone = isNone;
const isSome = (v) => v?.type === Some;
exports.isSome = isSome;
const isOption = (v) => isNone(v) || isSome(v);
const None = (e) => {
    if (isNone(e))
        return e;
    if (isSome(e))
        return None(e.join());
    const none = {
        type: None,
        join: () => e,
        map: () => none,
    };
    return none;
};
exports.None = None;
const Some = (x) => {
    if (isOption(x))
        return x;
    if (isNil(x))
        return None();
    const some = {
        type: Some,
        join: () => x,
        map: (fn) => {
            try {
                return Some(fn(x));
            }
            catch (e) {
                return None(e);
            }
        },
    };
    return some;
};
exports.Some = Some;
class TaskClass extends Promise {
    map = (fn) => super
        .then((v) => (isSome(v) ? v.map(fn) : v))
        .then(Some, None);
}
const Task = (fn) => new TaskClass(fn).then(Some, None);
exports.Task = Task;
