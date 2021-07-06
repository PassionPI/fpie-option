# fpie-option

fpie-option 是一个类`Monda`容器，提供了空值判断与错误捕获，共有两个状态，分别为`Some`和`None`

## Some;

此状态代表正常

1. `isSome`方法判断

```js
isSome(Some(1)); // 返回 true
```

2. `map`属性方法`操作`值

```js
Some(1).map((x) => x + 1); // 返回 Some(2)
```

3. `join`属性方法`获取`值

```js
Some(1).join(); // 返回 1
```

## None;

此状态代表`null`和`Error`

1. `isNone`方法判断

```js
isNone(None()); // 返回 true
```

2. `map`属性方法`操作`值

```js
None(1).map((x) => x + 1); // 返回 None(1)
```

3. `join`属性方法`获取`值

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
Some(None()); // 返回 None()
None(None(1)); // 返回 None(1)
None(Some(1)); // 返回 None(1)
```

2. 若`Some`值为空，或报错，会自动转为`None`

```js
Some(); // 返回 None()
Some(1).map(() => {}); // 返回 None()
Some(1).map(() => {
  throw "err";
}); // 返回 None('err')
```

3. `Some`和`None`具有相同接口，故不用考虑其相互转换的情况，只需在最后`join`取值之前，判断即可。

## Task;

基于`Promise`，封装`Some`和`None`

```js
Task((res, rej) => res(1));
// 等价于
new Promise((res, rej) => res(1)).then(Some, None);
// 返回Promise<Some(1)>
```

```js
Task((res, rej) => res(1)).map((v) => v + 1);
// 等价于
new Promise((res, rej) => res(1))
  .then(Some, None)
  .then((v) => v + 1)
  .then(Some, None);
// 返回Promise<Some(2)>
```

> `Task`仅有`map`属性方法，无`join`属性方法
>
> `join`属性方法，使用`await`代替

```js
await Task((res, rej) => res(1)).map((v) => v + 1); // 返回 Some(2)
await Task((res, rej) => res()).map((v) => v + 1); // 返回 None()
```
