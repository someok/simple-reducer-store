import React, {Context, createContext, useContext} from 'react';
import createReducer from 'react-use/esm/createReducer';
import produce from 'immer';

import composeReducerActions from './composeReducerActions';
import {convertActionParam} from './actionUtils';
import {Action, Dispatch, Middleware, PredefineActions} from './types';

/**
 * 基于 react-use createReducer 和 immer 的 react context 定义，用于代替 redux。
 *
 * 使用 react-use createReducer 以便支持 redux 格式的 middleware。
 *
 * example:
 *
 <pre>
 let middlewares = [];
 if (!isProd) {
    middlewares.push(logger);
 }

 const initialState = {
    foo: 'bar',
 };

 const [useAuthStore, AuthStoreProvider, AuthContext] = createReducerContext(...middlewares)(
 initialState,
 authActions
 );

 export {useAuthStore, AuthStoreProvider, AuthContext};
 </pre>
 *
 *
 * @param middlewares redux 格式的 middleware
 * @return 返回 function，参数中可定义 initialState, ...actions
 */
export default function createReducerContext<State>(...middlewares: Middleware<State>[]) {
    return (initialState: State, ...actions: PredefineActions[]) => {
        const StoreContext: Context<any> = createContext(undefined);
        const useReducer = createReducer(...middlewares);

        // 合并多个 action 定义到一个对象中
        const composeActions = composeReducerActions(...actions);

        /**
         * useReducer 参数中的 reducer，根据 dispatch 传入的 action 使用 immer 转换成相应的 state。
         *
         * action 参数支持字符串、数组、对象：
         *
         * 1. string (example: "actionName")
         * 2. array (example: ["actionName", payload])
         * 3. object (example: {type: "actionName", payload: xxx})
         *
         * @param state 转换前的 state
         * @param action 支持字符串、数组、对象
         * @return 转换后的 state
         */
        function reducer(state: State, action: Action): State {
            const {type, payload} = convertActionParam(action);
            return produce(state, draft => {
                const act = composeActions[type];
                if (!act) {
                    throw new Error(`action [${type}] not exist`);
                }
                act(draft, payload);
            });
        }

        const StoreProvider: React.FC = ({children}) => {
            const state = useReducer(reducer, initialState);
            const Provider = StoreContext.Provider;

            return <Provider value={state}>{children}</Provider>;
        };

        function useReducerStore(): [State, Dispatch] {
            // 返回 [state, dispatch]
            const state = useContext(StoreContext);
            if (state == null) {
                throw new Error(`useReducerStore must be used inside a StoreProvider.`);
            }
            return state;
        }

        return [useReducerStore, StoreProvider, StoreContext];
    };
}
