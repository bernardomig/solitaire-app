export enum Suit {
  Heart,
  Diamond,
  Spade,
  Club,
}

const S = Suit;

export const SUITS = [S.Heart, S.Diamond, S.Spade, S.Club];

export enum Color {
  Black,
  Red,
}

export const colorOf = (suit: Suit): Color =>
  suit === S.Diamond || suit === S.Heart ? Color.Red : Color.Black;

export enum Rank {
  Ace = "A",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Jack = "J",
  Queen = "Q",
  King = "K",
}

const R = Rank;

export const RANKS = [
  R.Ace,
  R.Two,
  R.Three,
  R.Four,
  R.Five,
  R.Six,
  R.Seven,
  R.Eight,
  R.Nine,
  R.Ten,
  R.Jack,
  R.Queen,
  R.King,
];

export function nextRank(rank: Rank | null): Rank | null {
  switch (rank) {
    case R.Ace:
      return null;
    case R.Two:
      return R.Ace;
    case R.Three:
      return R.Two;
    case R.Four:
      return R.Three;
    case R.Five:
      return R.Four;
    case R.Six:
      return R.Five;
    case R.Seven:
      return R.Six;
    case R.Eight:
      return R.Seven;
    case R.Nine:
      return R.Eight;
    case R.Ten:
      return R.Nine;
    case R.Jack:
      return R.Ten;
    case R.Queen:
      return R.Jack;
    case R.King:
      return R.Queen;
    default:
      return R.King;
  }
}

export interface Card {
  rank: Rank;
  suit: Suit;
}

export const ALL_CARDS = SUITS.flatMap((suit) =>
  RANKS.map((rank) => ({ suit, rank } as Card))
);
