# simple-reducer-store

## 缘起

之前使用 redux 做状态管理，react 出了 context、hooks 之后就逐渐使用后者了，现在把这些共性的东西抽出来，搞成个组件，
方便使用。

## 功能

-   使用 [react-use createReducer](https://github.com/streamich/react-use/blob/master/docs/createReducer.md)
    创建 reducer，这个的好处是支持 redux 的 middlewares，例如
    [redux-logger](https://github.com/theaqua/redux-logger)
-   使用 [immer](https://github.com/immerjs/immer) 处理 reducer

## 安装

```bash
npm i --save react react-use immer lodash redux-logger
npm i --save @someok/simple-reducer-store
```

```bash
yarn add react react-use immer lodash redux-logger
yarn add @someok/simple-reducer-store
```

## 使用

-   定义 {key: value} 格式的 action 对象，支持汇总多个 action，注意 key 不能重复
-   使用 `createReducerContext` 定义 store
-   在业务中返回对应 context 中存储的数据 `const [store, dispatch] = useAuthStore();`
-   dispatch 支持三种格式
    -   `dispatch('test')`: 没有 `payload` 数据的时候可以直接将 action key 作为参数
    -   `dispatch(['test', values])`: 支持数组 [actionKey, payload]，算是对于传统 object 格式的简化
    -   `dispatch({type: 'test', payload: values})`: 传统的对象格式

## 示例

**actions.js**

```javascript
const actions = {
    test: (draft, payload) => {
        draft.data = payload;
    },
};

export default actions;
```

**test.js**

```javascript
import {createReducerContext, logger} from '@someok/simple-reducer-store';
import {isProd} from '@/env';

import testActions from './actions';

let middlewares = [];

// middleware 只在生产环境起作用
if (!isProd) {
    middlewares.push(logger);
}

const initialState = {
    foo: 'bar',
};

const [useAuthStore, AuthStoreProvider, AuthContext] = createReducerContext(...middlewares)(
    initialState,
    testActions
);

export {useTestStore, TestStoreProvider, TestContext};
```

**App.js**

```javascript
ReactDOM.render(
    <TestStoreProvider>
        <App />
    </TestStoreProvider>,
    document.getElementById('root')
);
```

**TestPage.js**

```javascript
import {useTestStore} from './test';

export default function TestPage() {
    const [store, dispatch] = useTestStore();

    function click() {
        dispatch('test');
        dispatch(['test', values]);
        dispatch({type: 'test', payload: values});
    }

    return (
        <div>
            <button onClick={click}>Test</button>
        </div>
    );
}
```
