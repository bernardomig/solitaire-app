import { createContext, useContext, useState } from "react";

export type Selector<T, R> = (arg: T) => R;
export type Action<T> = (state: T) => T;

export const applyTo = <State, Key extends keyof State>(
  action: (arg: State[Key]) => State[Key],
  key: Key,
) => (state: State): State => ({ ...state, [key]: action(state[key]) });

export const applyIf = <State>(
  cond: Selector<State, boolean>,
  action: Action<State>,
): Action<State> => (state) => (cond(state) ? action(state) : state);

export const chain = <T>(...actions: Array<Action<T>>): Action<T> =>
  (
    state: T,
  ) => actions.reduce((s, action) => action(s), state);

export interface FlowContext<T> {
  state: T;
  dispatch: (action: Action<T>) => void;
}

export function createFlow<T>() {
  const Context = createContext<FlowContext<T>>(null!);

  const useFlow = (initial: T) => {
    const [state, dispatch] = useState(initial);
    return { state, dispatch };
  };

  const useDispatch = () => useContext(Context).dispatch;

  const useSelector = <R>(selector: Selector<T, R>): R =>
    selector(useContext(Context).state);

  return { Provider: Context.Provider, useFlow, useDispatch, useSelector };
}
