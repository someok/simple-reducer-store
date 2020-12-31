import {createLogger} from 'redux-logger';
import {convertActionParam, ActionParam} from './actionUtils';

/**
 * 由于 action 的格式可能是 string、array、object，所以这儿重新定义 redux-logger 的标题输出格式。
 *
 * @param action dispatch 的 action，格式可能是 string、array、object
 * @param time 执行时间
 * @param took 执行花费时间
 * @return {string} 格式化后的 title
 */
function titleFormatter(action: ActionParam, time: string, took: number): string {
    const convertAction = convertActionParam(action);
    const parts = ['action'];

    parts.push(`${String(convertAction.type)}`);
    parts.push(`@ ${time}`);
    parts.push(`(in ${took.toFixed(2)} ms)`);

    return parts.join(' ');
}

const logger = createLogger({
    titleFormatter,
});

export default logger;
