import {
  useGameDispatch,
  moveCardOnTableau,
  moveCardFromHandToTableau,
  moveCardFromTableauToFoundation,
  useGameSelector,
} from "../game";
import Card from "./Card";
import styled from "@emotion/styled";
import { Card as ICard } from "../game/card";
import { useDrag, useDrop } from "react-dnd";
import { SelectableProvider, useSelectable } from "../hooks/selectable-hook";

const Container = styled.div`
  display: flex;
  gap: 32px;
  justify-items: flex-start;
  align-items: flex-start;
`;

const PackContainer = styled.div`
  width: 135px;
  position: relative;
`;

const Item = styled.div<{ selected?: boolean }>`
  border-radius: 8px;
  position: absolute;
  top: 36px;

  :first-child {
    top: 0;
  }

  cursor: grab;

  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  ${(props) =>
    props.selected &&
    `
      transform: translate(0px, -6px);
      box-shadow: 0px 6px 0 0 rgba(255, 255, 255, 0.2);
    `}
`;

function PackItem({
  index,
  cards,
}: {
  index: number;
  cards: Array<ICard & { sideDown?: boolean }>;
}) {
  const [, drag] = useDrag(
    () => ({
      type: "card",
      item: {
        source: "foundation",
        card: cards.length > 0 ? cards[0] : null,
        position: { pile: index, index: cards.length - 1 },
      },
      canDrag: () => cards.length > 0 && !cards[0].sideDown,
      collect: (monitor) => ({ canDrag: monitor.canDrag() }),
    }),
    [cards, index]
  );

  const { isSelected, select, unSelect } = useSelectable();

  const dispatch = useGameDispatch();

  const cardId = cards.length - 1;

  if (cards.length === 0) return null;
  const [card, ...rest] = cards;

  return (
    <Item ref={drag} selected={isSelected(cardId)}>
      {card.sideDown ? (
        <Card variant="flipped" />
      ) : (
        <div
          onMouseEnter={() => select(cardId)}
          onMouseLeave={() => unSelect(cardId)}
          onDoubleClick={() => {
            dispatch(moveCardFromTableauToFoundation({ pile: index }));
          }}
        >
          <Card variant="default" {...card} />
        </div>
      )}

      <PackItem index={index} cards={rest} />
    </Item>
  );
}

function Pack({ index, cards }: { index: number; cards: Array<ICard> }) {
  const dispatch = useGameDispatch();

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      drop: (
        drop:
          | {
              source: "foundation";
              card: ICard | null;
              position: { pile: number; index: number };
            }
          | { source: "hand"; card: ICard }
      ) => {
        if (drop.source === "foundation") {
          dispatch(moveCardOnTableau({ from: drop.position, to: index }));
        } else if (drop.source === "hand") {
          dispatch(moveCardFromHandToTableau({ pile: index }));
        }
      },
    }),
    [dispatch, index, cards]
  );

  return (
    <PackContainer ref={drop}>
      <SelectableProvider>
        {cards.length > 0 ? (
          <PackItem index={index} cards={cards.slice().reverse()} />
        ) : (
          <Card variant="placeholder" />
        )}
      </SelectableProvider>
    </PackContainer>
  );
}

export function Tableau() {
  const tableau = useGameSelector((game) => game.tableau);

  return (
    <Container>
      {tableau.map((pack, index) => (
        <Pack key={index} index={index} cards={pack} />
      ))}
    </Container>
  );
}

export default Tableau;
