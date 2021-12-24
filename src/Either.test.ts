import { step, err, ok, isErr, isOk } from "./Either";

const some_1 = ok(1);
const some_null = ok();
const some_nest = ok(some_1);
const some_add_1 = some_1.map((v) => v + 1);
const some_1_chain = some_1.map(v => ok(v));
const some_err = some_1.map(() => {
  throw 777;
});
//@ts-expect-error
const some_err_map = some_err.map((v) => v + 1);

test("isOk", () => {
  expect(isOk(some_1)).toBe(true);
  //@ts-expect-error
  expect(isOk()).toBe(false);
  expect(isOk(null)).toBe(false);
  expect(isOk(NaN)).toBe(false);
  expect(isOk('')).toBe(false);
  expect(isOk('1')).toBe(false);
  expect(isOk(true)).toBe(false);
  expect(isOk(false)).toBe(false);
  expect(isOk(0)).toBe(false);
  expect(isOk(1)).toBe(false);
  expect(isOk({})).toBe(false);
  expect(isOk([])).toBe(false);
  expect(isOk(/a/)).toBe(false);
  expect(isOk(() => { })).toBe(false);
  expect(isOk(class { })).toBe(false);
  expect(isOk(function () { })).toBe(false);
});

test("some join", () => {
  expect(some_1.join()).toBe(1);
  expect(some_1_chain.join()).toBe(1);
  expect(ok(ok(ok(1))).join()).toBe(1)
});

test("some map", () => {
  expect(isOk(some_add_1)).toBe(true);
  expect(some_add_1.join()).toBe(2);
});

test("some null", () => {
  expect(some_null.join() == null).toBe(true);
});

test("some err", () => {
  const err_msg = 777;
  expect(isErr(some_err)).toBe(true);
  //@ts-expect-error
  expect(some_err.join()).toBe(err_msg);
  expect(some_err_map).toBe(some_err);
  expect(some_err_map.join()).toBe(err_msg);
});

test("some nest", () => {
  expect(isOk(some_nest)).toBe(true);
  expect(some_nest).toBe(some_1);
  expect(some_nest.join()).toBe(1);
});

const none_1 = err(1);
const none_null = err();
const none_nest = err(none_1);
test("isErr", () => {
  expect(isErr(none_1)).toBe(true);
  expect(isErr(none_null)).toBe(true);
});

test("err join", () => {
  expect(none_1.join()).toBe(1);
  expect(none_null.join() == null).toBe(true);
});

test("err map", () => {
  expect(none_1.map("any")).toBe(none_1);
  expect(none_null.map("any")).toBe(none_null);
});

test("err nest", () => {
  expect(isErr(none_nest)).toBe(true);
  expect(none_nest).toBe(none_1);
  expect(none_nest.join()).toBe(1);
});

test("ok & err", () => {
  const ss1 = ok(some_1);
  const sn1 = ok(none_1);
  const ns1 = err(some_1);
  const nn1 = err(none_1);
  expect(isOk(ss1)).toBe(true);
  expect(isErr(sn1)).toBe(true);
  expect(isErr(ns1)).toBe(true);
  expect(isErr(nn1)).toBe(true);
  expect(ss1.join()).toBe(1);
  expect(sn1.join()).toBe(1);
  expect(ns1.join()).toBe(1);
  expect(nn1.join()).toBe(1);
  expect(ss1).toBe(some_1);
  expect(sn1).toBe(none_1);
  expect(ns1 === none_1).toBe(false);
  expect(nn1).toBe(none_1);
});

test("step err", async () => {
  const err1 = await step(() => { throw 'err' });
  expect(err1.join()).toBe('err');
  expect(isErr(err1)).toBe(true);

  const err2 = await step<number>((s) => s(1)).map(() => { throw 'err' }) as any;
  expect(err2.join()).toBe('err');
  expect(isErr(err2)).toBe(true);

  const err3 = await err2.map('888');
  expect(err3).toBe(err2);
  expect(err3.join()).toBe('err');
  expect(isErr(err3)).toBe(true);

  const err4 = await step<number>((s) => s(1)).map(() => step(() => { throw 'err' })) as any;
  expect(err4.join()).toBe('err');
  expect(isErr(err4)).toBe(true);

  const err5 = await step<number>((s) => s(1)).map((v) => step((s, j) => j(`j${v}`))) as any;
  expect(err5.join()).toBe('j1');
  expect(isErr(err5)).toBe(true);

  const err6 = await err5.map('888');
  expect(err6).toBe(err5);
  expect(err6.join()).toBe('j1');
  expect(isErr(err6)).toBe(true);

  const err7 = await step<number>((s) => s(1)).map(() => { }) as any;
  expect(err7.join()).toBe(undefined);
})

test("step nest", async () => {
  const res1 = await step<number>((s) => s(1))
    .map((v) => step<number>((s) => s(v + 1)))
    .map((v) => step<number>((s) => s(v + 1)))
    .map((v) => step<number>((s) => s(v + 1)));
  expect(isOk(res1)).toBe(true);
  expect(res1.join()).toBe(4);

  const res2 = await step<number>((s) => s(1)).map((v) =>
    step<number>((s) => s(v + 1)).map((v) =>
      step<number>((s) => s(v + 1)).map((v) =>
        step<number>((s) => s(v + 1))
      )
    )
  );
  expect(isOk(res2)).toBe(true);
  expect(res2.join()).toBe(4);

  const res3 = await step<number>((s) => s(1)).map((v) =>
    step<number>((s) => s(v + 1)).map((v) =>
      step<number>((s) => s(v + 1)).map((v) =>
        step<number>((s) => s(v + 1))
      )
    )
  ).map((v) =>
    step<number>((s) => s(v + 1)).map((v) =>
      step<number>((s) => s(v + 1)).map((v) =>
        step<number>((s) => s(v + 1))
      )
    )
  );
  expect(isOk(res3)).toBe(true);
  expect(res3.join()).toBe(7);
});
