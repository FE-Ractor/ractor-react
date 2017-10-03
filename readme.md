# ractor-react

## 安装

```ts
npm i ractor-react
```

## state store vs domain store

`ractor-react` 支持两种用法，分别是 `动态加载` 和 `依赖注入`。分别对应 `mobx` 的 `state store` 和 `redux` 的 `domain store`。

### state store

所谓 `state store`， 就是你可以把 store 当一个外部状态使用，和内部状态类似，view 是监听这个 state 的，也是动态加载和卸载的。

```ts
@connect(CounterStore)
export class Counter extends React.Component<{ value: number }> {}
```

这里注入的 store 在组件 `didMount` 的时候初始化并订阅，在组件 `Unmount` 的时候取消监听。你可以把这个 store 和你组件放在一起，仅仅作为状态和行为的集合，和视图做逻辑分离。

具体代码可以看 examples 里的 counter

### domain store

`domain store`。类似领域驱动设计里的 `model`，对应后端的 model 层，也可以简单的理解为对应数据库里的表。和 redux 的 reducer 有点类似。

```ts
render(
  <Provider stores={[TodoStore]}>
    {React.createElement(Todo)}
  </Provider>,
  document.getElementById("app")
)
```

使用 `Provider` 组件注入 我们所有的 store，Provider 内部会依次全部实例化，并放在 context 里面。

```ts
@connect(TodoStore)
export default class TodoComponent extends React.Component<TodoState, {}> {}
```

上面这段代码和 counter 里的用法一模一样，但是如果你已经使用 `Provider` 往 context 里面注入了 store 的话，这里不再会实例化 TodoStore，而是去 context 里面找里面的实例是否 `instance of` 注入的 class。如果找到了就监听他，没找到才会实例化。

看到这里那些喜欢 mobx 和 redux 的同学们不用纠结了，两种写法都适合你...

## Api

### Privider

高阶组件，需要传入 stores 数组。

```ts
<Provider stores={[TodoStore, CounterStore]}>
  // 你的组件
</Provider>,
```

### connect

连接 store 和 react 的组件

```ts
@connect(TodoStore)(TodoComponent)
```