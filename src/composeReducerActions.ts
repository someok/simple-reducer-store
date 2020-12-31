import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';

/**
 * 组合多个 reducer action 到一个对象中。
 *
 * @param actions 格式为： {actionName: (draft, payload) => {draft.xxx = yyy}}
 * @return {{}} 多个 action 组合后的对象
 */
export default function composeReducerActions(...actions) {
    const composeActions = {};

    if (isEmpty(actions)) {
        return composeActions;
    }

    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        if (!isPlainObject(action)) {
            throw new Error('action must be plain object');
        }

        const composeKeys = Object.keys(composeActions);
        const keys = Object.keys(action);

        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            if (composeKeys.includes(key)) {
                throw new Error(`action has duplicate key: ${key}`);
            }

            if (!isFunction(action[key])) {
                throw new Error(`action [${key}] must be function`);
            }

            composeActions[key] = action[key];
        }
    }
    return composeActions;
}
