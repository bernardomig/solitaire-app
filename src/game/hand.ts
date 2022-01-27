import { Action, applyIf, applyTo, Selector } from "../lib/flow";

import { Card } from "./card";

export interface State {
  stock: Array<Card>;
  waste: Array<Card>;
}

export const drawCard: Selector<State, Card | null> = (state) =>
  state.waste.length > 0 ? state.waste[0] : null;

export const stockSize: Selector<State, number> = (state) => state.stock.length;

export const hasStock: Selector<State, boolean> = (state) =>
  state.stock.length > 0;

export const draw: Action<State> = (state) => {
  if (!hasStock(state)) return state;

  const {
    stock: [card, ...stock],
    waste,
  } = state;

  return { stock, waste: [card, ...waste] };
};

export const reDraw: Action<State> = (state) => {
  if (hasStock(state)) return state;
  return { stock: state.waste.slice().reverse(), waste: [] };
};

export const popCard: Action<State> = applyIf(
  (s) => drawCard(s) !== null,
  applyTo((waste) => waste.slice(1), "waste"),
);
