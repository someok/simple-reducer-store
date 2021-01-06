import React, {Context} from 'react';
import createReducerContext from './createReducerContext';
import {createDefaultLogger} from './loggerMiddleware';
import {Dispatch, Middleware, PredefineActions} from './types';

/**
 * 默认集成 logger 中间件。
 *
 * @param initialState
 * @param actions
 */
export default function initReducerContext<State>(
    initialState: State,
    ...actions: PredefineActions[]
): [() => [State, Dispatch], React.FC, Context<any>] {
    let middlewares: Middleware<State>[] = [];
    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createDefaultLogger());
    }

    return createReducerContext(...middlewares)(initialState, ...actions);
}
