import * as Foundation from "./foundation";
import type { State as FoundationState } from "./foundation";
import * as Hand from "./hand";
import type { State as HandState } from "./hand";
import * as Tableau from "./tableau";
import type { State as TableauState } from "./tableau";
import { rangeRight, shuffle, slice, take } from "lodash";
import { ALL_CARDS } from "./card";

import { Action, applyTo, chain, createFlow } from "../lib/flow";

export interface RootState {
  hand: HandState;
  foundation: FoundationState;
  tableau: TableauState;
}

export const flipCards: Action<RootState> = applyTo(
  Tableau.flipCards,
  "tableau",
);

export const moveCardFromHandToFoundation: () => Action<RootState> = () =>
  (
    state,
  ) => {
    const { hand, foundation } = state;

    const card = Hand.drawCard(hand);
    if (card === null) return state;

    if (!Foundation.canMove(card)(foundation)) return state;

    return {
      ...state,
      hand: Hand.popCard(hand),
      foundation: Foundation.pushCard(card)(foundation),
    };
  };

export const moveCardFromHandToTableau: (args: {
  pile: number;
}) => Action<RootState> = ({ pile }) =>
  (state) => {
    const { hand, tableau } = state;

    const card = Hand.drawCard(hand);
    if (card === null) return state;
    if (!Tableau.canMove({ card, pile })(tableau)) return state;

    return {
      ...state,
      hand: Hand.popCard(hand),
      tableau: Tableau.pushCard({ card, pile })(tableau),
    };
  };

export const moveCardFromTableauToFoundation: (args: {
  pile: number;
}) => Action<RootState> = ({ pile }) =>
  (state) => {
    const { foundation, tableau } = state;

    const card = Tableau.topCard({ pile })(tableau);
    if (card === null) return state;
    if (!Foundation.canMove(card)(foundation)) return state;

    return flipCards({
      ...state,
      foundation: Foundation.pushCard(card)(foundation),
      tableau: Tableau.popCard({ pile })(tableau),
    });
  };

export const moveCardOnTableau: (args: {
  from: Tableau.Position;
  to: number;
}) => Action<RootState> = ({ from, to }) =>
  (state) => {
    const { tableau } = state;

    const card = tableau[from.pile][from.index];

    const canMove = Tableau.canMove({ card, pile: to })(tableau);

    if (!canMove) return state;

    return chain(
      applyTo(Tableau.moveCard({ from, to }), "tableau"),
      flipCards,
    )(state);
  };

export const autoMove: Action<RootState> = (state) => {
  const hasMovableCards = state.tableau.some(
    (pile) => pile.length > 0 && Foundation.canMove(pile[0])(state.foundation),
  );

  if (!hasMovableCards) return state;

  const newState = state.tableau.reduce(
    (s, _, pile) => moveCardFromTableauToFoundation({ pile })(s),
    state,
  );
  return autoMove(newState);
};

export function createGame(): RootState {
  let cards = shuffle(ALL_CARDS);
  let tableau = [];

  for (let stockCards of rangeRight(1, 8)) {
    const stock = take(cards, stockCards);
    cards = slice(cards, stockCards);
    tableau.push(stock.map((card) => ({ ...card, sideDown: true })));
  }

  return {
    tableau: Tableau.flipCards(tableau),
    hand: { stock: cards, waste: [] },
    foundation: Foundation.INITIAL_STATE,
  };
}

const {
  Provider: GameProvider,
  useSelector: useGameSelector,
  useDispatch: useGameDispatch,
  useFlow: useGame,
} = createFlow<RootState>();

export { GameProvider, useGame, useGameDispatch, useGameSelector };

export const useDeal = () =>
  useGameSelector((game) => Hand.drawCard(game.hand));
export const useHasStock = () =>
  useGameSelector((game) => Hand.hasStock(game.hand));

export const draw: Action<RootState> = applyTo(Hand.draw, "hand");
export const reDraw: Action<RootState> = applyTo(Hand.reDraw, "hand");
