type ActionParamString = string;

type ActionParamArray = [string, any];

export interface ActionParamObject {
    type: string;
    payload?: any;
}

export type Action = ActionParamString | ActionParamArray | ActionParamObject;

export type Dispatch = (action: Action) => void;
export interface Store<State> {
    getState: () => State;
    dispatch: Dispatch;
}
export type Middleware<State> = (
    store: Store<State>
) => (next: Dispatch) => (action: Action) => void;

export interface PredefineActions {
    [key: string]: any;
}
