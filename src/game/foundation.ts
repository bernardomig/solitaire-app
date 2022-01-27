import { Card, nextRank, Rank, Suit } from "../game/card";

import { Action, Selector } from "../lib/flow";

export type State = Record<Suit, Rank | undefined>;

export const INITIAL_STATE: State = {
  0: undefined,
  1: undefined,
  2: undefined,
  3: undefined,
};

export const canMove: (card: Card) => Selector<State, boolean> = (card) =>
  (
    state,
  ) => nextRank(card.rank) === (state[card.suit] || null);

export const pushCard: (card: Card) => Action<State> = (card) =>
  (state) => {
    if (!canMove(card)(state)) throw Error("Invalid move");
    return { ...state, [card.suit]: card.rank };
  };
