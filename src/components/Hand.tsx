import {
  useDeal,
  useHasStock,
  useGameDispatch,
  draw,
  reDraw,
  moveCardFromHandToFoundation,
} from "../game";

import styled from "@emotion/styled";
import Card from "./Card";

import { keyframes } from "@emotion/react";
import { useDrag } from "react-dnd";

const HandContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

const Stock = styled.div`
  border-radius: 8px;

  transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;

  :hover {
    transform: translateX(8px);
    box-shadow: -8px 0 0 0 rgba(255, 255, 255, 0.2);
  }
`;

const enterSwipeLeft = keyframes`
    from {
      transform: translateX(-8px);
    }
    to {
      transform: translateX(0);
    }
  `;

const Deal = styled.div`
  border-radius: 8px;

  transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: grab;

  animation-name: ${enterSwipeLeft};
  animation-duration: 0.15s;
  animation-iteration-count: 1;

  :hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 0 0 rgba(255, 255, 255, 0.2);
  }
`;

export function Hand() {
  const hand = useDeal();
  const hasStock = useHasStock();

  const dispatch = useGameDispatch();

  const [, drag] = useDrag(
    () => ({
      type: "card",
      item: { source: "hand", card: hand },
    }),
    [hand]
  );

  return (
    <HandContainer>
      {hasStock ? (
        <Stock onClick={() => dispatch(draw)}>
          <Card variant="flipped" />
        </Stock>
      ) : (
        <div style={{ cursor: "pointer" }} onClick={() => dispatch(reDraw)}>
          <Card variant="placeholder" />
        </div>
      )}
      {hand !== null ? (
        <Deal key={`${hand.rank}-${hand.suit}`}>
          <div
            ref={drag}
            onDoubleClick={() => dispatch(moveCardFromHandToFoundation())}
          >
            <Card variant="default" rank={hand.rank} suit={hand.suit} />
          </div>
        </Deal>
      ) : (
        <Card variant="placeholder" />
      )}
    </HandContainer>
  );
}

export default Hand;
