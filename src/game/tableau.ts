import { Card, colorOf, nextRank, Rank } from "./card";
import { Action, Selector } from "../lib/flow";

export type State = Array<Array<Card & { sideDown: boolean }>>;

export interface Position {
  pile: number;
  index: number;
}

export const canMove: (args: {
  card: Card;
  pile: number;
}) => Selector<State, boolean> = ({ card, pile }) =>
  (state) =>
    state[pile].length > 0
      ? nextRank(state[pile][0].rank) === card.rank &&
        colorOf(card.suit) !== colorOf(state[pile][0].suit)
      : card.rank === Rank.King;

export const moveCard: (args: {
  from: Position;
  to: number;
}) => Action<State> = ({ from, to }) =>
  (state) => {
    const card = state[from.pile][from.index];
    if (!canMove({ card, pile: to })(state)) throw Error("invalid state");

    return state.map((cards, index) =>
      index === from.pile
        ? cards.slice(from.index + 1)
        : index === to
        ? [...state[from.pile].slice(0, from.index + 1), ...cards]
        : cards
    );
  };

export const topCard: (args: {
  pile: number;
}) => Selector<State, Card | null> = ({ pile }) =>
  (state) => state[pile].length > 0 ? state[pile][0] : null;

export const pushCard: (args: {
  card: Card;
  pile: number;
}) => Action<State> = ({ card, pile }) =>
  (state) => {
    if (!canMove({ card, pile })(state)) throw Error("invalid state");

    return state.map((cards, index) =>
      pile === index ? [{ ...card, sideDown: false }, ...cards] : cards
    );
  };

export const popCard: (args: { pile: number }) => Action<State> = ({
  pile,
}) =>
  (state) =>
    state.map((cards, index) => (pile === index ? cards.slice(1) : cards));

export const flipCards: Action<State> = (state) =>
  state.map((pile) => {
    if (pile.length === 0) return pile;

    const [topCard, ...rest] = pile;

    return [{ ...topCard, sideDown: false }, ...rest];
  });
