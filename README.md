# fpie-option

fpie-option 是一个类`Monda`容器，提供了空值判断与错误捕获，共有两个状态，分别为`Some`和`None`

## import;

```js
import { Some, isSome, None, isNone, Task } from "fpie-option";
import { Ok, isOk, Err, isErr, Step } from "fpie-option";
```

## Some;

此状态代表正常

1. `isSome`方法判断

```js
isSome(Some(1)); // 返回 true
```

2. `map`属性方法 _操作_ 值

```js
Some(1).map((x) => x + 1); // 返回 Some(2)
```

3. `join`属性方法 _获取_ 值

```js
Some(1).join(); // 返回 1
```

## None;

此状态代表`null`或`Error`

1. `isNone`方法判断

```js
isNone(None()); // 返回 true
```

2. `map`属性方法 _操作_ 值(不执行`map`中的函数)

```js
None(1).map((x) => x + 1); // 返回 None(1)
```

3. `join`属性方法 _获取_ 值

```js
None(1).join(); // 返回 1
```

> 值为`null`时 `None().join()` 返回 null
>
> 报错`Error`时 `None('err msg').join()` 返回错误信息

## Some & None;

1. `Some`和`None`均不会产生嵌套，也不会互相存储

```js
Some(Some(1)); // 返回 Some(1)
Some(None(1)); // 返回 None(1)
None(Some(1)); // 返回 None(1)
None(None(1)); // 返回 None(1)
```

2. 若`Some`值为空，或报错，会自动转为`None`

```js
Some(); // 返回 None()
Some(1).map(() => {}); // 返回 None()
Some(1).map(() => {
  throw "err";
}); // 返回 None('err')
```

3. `Some`的错误捕获

若想在`map`方法中处理错误，可以传入第二个参数，用于捕获错误

```js
Some(1).map(
  () => {
    throw "err";
  },
  () => "catch err"
); // 返回 Some('catch err')
Some(1).map(
  () => {
    throw "err";
  },
  () => {
    throw "catch err failed";
  }
); // 返回 None('catch err failed')
```

4. `Some`和`None`具有相同接口，故不用考虑其相互转换的情况，只需在最后`join`取值之前，判断类型即可。

## Task;

基于`Promise`，封装`Some`和`None`

```js
Task((res, rej) => res(1));
// 等价于
new Promise((res, rej) => res(1)).then(Some, None);
// 返回Promise<Some(1)>
```

```js
const add = (x) => x + 1;
Task((res, rej) => res(1)).map(add);
// 等价于
new Promise((res, rej) => res(1))
  .then(Some, None)
  .then((some) => some.map(add));
// 返回Promise<Some(2)>
```

> `Task`仅有`map`属性方法，无`join`属性方法
>
> 若想取出最终的`option`类型，使用`await`
>
> `Task`最终的`option`类型，其转换规则与`Some`和`None`的转换规则相同

```js
async () => {
  await Task((res, rej) => res(1)).map((v) => v + 1); // 返回 Some(2)
  await Task((res, rej) => rej(1)).map((v) => v + 1); // 返回 None(1)
};
```

## Ok, isOk, Err, isErr, Step

依次对应参考`Some`, `isSome`, `None`, `isNone`, `Task`

区别为，当`Ok`值为`null`或`undefined`或`NaN`时，并不会转换为`Err`

其余一致
