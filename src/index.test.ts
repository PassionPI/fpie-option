import { Task, None, Some, isNone, isSome } from "./index";

const some_1 = Some(1);
const some_null = Some();
// @ts-ignore
const some_null_map = some_null.map((v) => v + 1);
const some_nest = Some(some_1);
const some_add_1 = some_1.map((v) => v + 1);
const some_err = some_1.map(() => {
  throw 777;
});
const some_err_map = some_err.map((v) => v + 1);

test("isSome", () => {
  expect(isSome(some_1)).toBe(true);
  expect(isSome(some_null)).toBe(false);
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
  expect(some_err_map.join()).toBe(err_msg);
});

test("some nest", () => {
  expect(isSome(some_nest)).toBe(true);
  expect(some_nest.join()).toBe(1);
});

test("isNone", () => {
  expect(isNone(None(1))).toBe(true);
  expect(isNone(None())).toBe(true);
});

test("Some & None", () => {
  // expect(Some(Some(1))).toEqual(Some(1));
  // expect(Some(None(1))).toEqual(None(1));
  // expect(None(Some(1))).toEqual(None(1));
  // expect(None(None(1))).toEqual(None(1));
});

test("Task", async () => {
  const res = await Task<number>((s) => s(1))
    .map((v) => Task<number>((s) => s(v + 1)))
    .map((v) => Task<number>((s) => s(v + 1)))
    .map((v) => Task((s) => s(v + 1)));
});
