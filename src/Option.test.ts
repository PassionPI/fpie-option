// import { Task } from "./index";
import { Task, None, Some, isNone, isSome } from "./index";
// import { okCreate, err as None, isErr as isNone, isOk as isSome } from './Either'
// const Some = okCreate(v => v == null || Object.is(v, NaN))
const some_1 = Some(1);
const some_null = Some();
const some_nest = Some(some_1);
const some_null_map = some_null.map((v: any) => v + 1);
const some_add_1 = some_1.map((v) => v + 1);
const some_err = some_1.map(() => {
  throw 777;
});
const some_err_map = some_err.map((v) => v + 1);

test("isSome", () => {
  expect(isSome(some_1)).toBe(true);
  expect(isSome(some_null)).toBe(false);
  //@ts-expect-error
  expect(isSome()).toBe(false);
  expect(isSome(null)).toBe(false);
  expect(isSome(NaN)).toBe(false);
  expect(isSome('')).toBe(false);
  expect(isSome('1')).toBe(false);
  expect(isSome(true)).toBe(false);
  expect(isSome(false)).toBe(false);
  expect(isSome(0)).toBe(false);
  expect(isSome(1)).toBe(false);
  expect(isSome({})).toBe(false);
  expect(isSome([])).toBe(false);
  expect(isSome(/a/)).toBe(false);
  expect(isSome(() => { })).toBe(false);
  expect(isSome(class { })).toBe(false);
  expect(isSome(function () { })).toBe(false);
});

test("some join", () => {
  expect(some_1.join()).toBe(1);
});

test("some map", () => {
  expect(isSome(some_add_1)).toBe(true);
  expect(some_add_1.join()).toBe(2);
});

test("some null", () => {
  expect(isNone(some_null)).toBe(true);
  expect(some_null.join() == null).toBe(true);
  expect(some_null_map.join() == null).toBe(true);
});

test("some err", () => {
  const err_msg = 777;
  expect(isNone(some_err)).toBe(true);
  expect(some_err.join()).toBe(err_msg);
  expect(some_err_map).toBe(some_err);
  expect(some_err_map.join()).toBe(err_msg);
});

test("some nest", () => {
  expect(isSome(some_nest)).toBe(true);
  expect(some_nest).toBe(some_1);
  expect(some_nest.join()).toBe(1);
});

const none_1 = None(1);
const none_null = None();
const none_nest = None(none_1);
test("isNone", () => {
  expect(isNone(none_1)).toBe(true);
  expect(isNone(none_null)).toBe(true);
});

test("None join", () => {
  expect(none_1.join()).toBe(1);
  expect(none_null.join() == null).toBe(true);
});

test("None map", () => {
  expect(none_1.map("any")).toBe(none_1);
  expect(none_null.map("any")).toBe(none_null);
});

test("None nest", () => {
  expect(isNone(none_nest)).toBe(true);
  expect(none_nest).toBe(none_1);
  expect(none_nest.join()).toBe(1);
});

test("Some & None", () => {
  const ss1 = Some(some_1);
  const sn1 = Some(none_1);
  const ns1 = None(some_1);
  const nn1 = None(none_1);
  expect(isSome(ss1)).toBe(true);
  expect(isNone(sn1)).toBe(true);
  expect(isNone(ns1)).toBe(true);
  expect(isNone(nn1)).toBe(true);
  expect(ss1.join()).toBe(1);
  expect(sn1.join()).toBe(1);
  expect(ns1.join()).toBe(1);
  expect(nn1.join()).toBe(1);
  expect(ss1).toBe(some_1);
  expect(sn1).toBe(none_1);
  expect(ns1 === none_1).toBe(false);
  expect(nn1).toBe(none_1);
});

test("Task err", async () => {
  const err1 = await Task(() => { throw 'err' });
  expect(err1.join()).toBe('err');
  expect(isNone(err1)).toBe(true);

  const err2 = await Task<number>((s) => s(1)).map(() => { throw 'err' }) as any;
  expect(err2.join()).toBe('err');
  expect(isNone(err2)).toBe(true);

  const err3 = await err2.map('888');
  expect(err3).toBe(err2);
  expect(err3.join()).toBe('err');
  expect(isNone(err3)).toBe(true);

  const err4 = await Task<number>((s) => s(1)).map(() => Task(() => { throw 'err' })) as any;
  expect(err4.join()).toBe('err');
  expect(isNone(err4)).toBe(true);

  const err5 = await Task<number>((s) => s(1)).map((v) => Task((s, j) => j(`j${v}`))) as any;
  expect(err5.join()).toBe('j1');
  expect(isNone(err5)).toBe(true);

  const err6 = await err5.map('888');
  expect(err6).toBe(err5);
  expect(err6.join()).toBe('j1');
  expect(isNone(err6)).toBe(true);

  const err7 = await Task<number>((s) => s(1)).map(() => { }) as any;
  expect(err7.join()).toBe(undefined);
  expect(isNone(err7)).toBe(true);
})

test("Task nest", async () => {
  const res1 = await Task<number>((s) => s(1))
    .map((v) => Task<number>((s) => s(v + 1)))
    .map((v) => Task<number>((s) => s(v + 1)))
    .map((v) => Task<number>((s) => s(v + 1)));
  expect(isSome(res1)).toBe(true);
  expect(res1.join()).toBe(4);

  const res2 = await Task<number>((s) => s(1)).map((v) =>
    Task<number>((s) => s(v + 1)).map((v) =>
      Task<number>((s) => s(v + 1)).map((v) =>
        Task<number>((s) => s(v + 1))
      )
    )
  );
  expect(isSome(res2)).toBe(true);
  expect(res2.join()).toBe(4);

  const res3 = await Task<number>((s) => s(1)).map((v) =>
    Task<number>((s) => s(v + 1)).map((v) =>
      Task<number>((s) => s(v + 1)).map((v) =>
        Task<number>((s) => s(v + 1))
      )
    )
  ).map((v) =>
    Task<number>((s) => s(v + 1)).map((v) =>
      Task<number>((s) => s(v + 1)).map((v) =>
        Task<number>((s) => s(v + 1))
      )
    )
  );
  expect(isSome(res3)).toBe(true);
  expect(res3.join()).toBe(7);
});
