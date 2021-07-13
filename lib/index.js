"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSome = exports.isNone = exports.Some = exports.None = exports.Task = void 0;
const baseTask_1 = require("./baseTask");
const isNone = (v) => v?.type == None;
exports.isNone = isNone;
const isSome = (v) => v?.type == Some;
exports.isSome = isSome;
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
    if (isNone(x) || isSome(x))
        return x;
    if (x == null || Object.is(x, NaN))
        return None();
    return {
        type: Some,
        join: () => x,
        map: (f) => {
            try {
                return Some(f(x));
            }
            catch (e) {
                return None(e);
            }
        },
    };
};
exports.Some = Some;
const Task = (f) => new baseTask_1.P(f).then(Some, None);
exports.Task = Task;
