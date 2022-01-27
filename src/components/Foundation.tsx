/** @jsxImportSource @emotion/react */

import {
  useGameDispatch,
  moveCardFromHandToFoundation,
  moveCardFromTableauToFoundation,
  useGameSelector,
} from "../game";

import Card from "./Card";

import { useDrop } from "react-dnd";
import { Card as ICard, SUITS } from "../game/card";

export default function Foundation() {
  const foundation = useGameSelector((game) => game.foundation);

  const dispatch = useGameDispatch();

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      drop: (
        item:
          | { source: "hand"; card: ICard }
          | { source: "foundation"; position: { index: number; pile: number } }
      ) => {
        if (item.source === "hand") {
          dispatch(moveCardFromHandToFoundation());
        } else if (item.source === "foundation") {
          dispatch(
            moveCardFromTableauToFoundation({ pile: item.position.pile })
          );
        }
      },
    }),
    [foundation, dispatch]
  );

  return (
    <div
      css={{ display: "flex", gap: 32, justifyContent: "flex-end" }}
      ref={drop}
    >
      {SUITS.map((suit) =>
        foundation[suit] !== undefined ? (
          <Card
            variant="default"
            key={suit}
            suit={suit}
            rank={foundation[suit]!}
          />
        ) : (
          <Card key={suit} variant="placeholder" />
        )
      )}
    </div>
  );
}
