import isPlainObject from 'lodash/isPlainObject';

type ActionParamString = string;

type ActionParamArray = [string, any];

interface ActionParamObject {
    type: string;
    payload?: any;
}

export type ActionParam = ActionParamString | ActionParamArray | ActionParamObject;

/**
 * 转换 action 为 {type: 'actionName', payload: xxx} 对象。
 *
 * action 参数支持字符串、数组、对象：
 *
 * 1. string (example: "actionName")
 * 2. array (example: ["actionName", payload])
 * 3. object (example: {type: "actionName", payload: xxx})
 *
 * @param action
 * @return {{payload, type: string}|{type: string}|{payload: *, type: string}}
 */
export function convertActionParam(action: ActionParam): ActionParamObject {
    if (!action) {
        throw new Error('action is required');
    }

    if (typeof action === 'string') {
        return {type: action};
    }

    if (Array.isArray(action)) {
        const [type, payload] = action;
        if (type) {
            return {type, payload};
        }
    }

    if (isPlainObject(action)) {
        const {type, payload} = action as ActionParamObject;
        if (type) {
            return {type, payload};
        }
    }

    throw new Error(
        'action must be string (example: "actionName") or array (example: ["actionName", payload]) or object (example: {type: "actionName", payload})'
    );
}
