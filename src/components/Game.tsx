/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";

import styled from "@emotion/styled";
import Hand from "./Hand";
import Foundation from "./Foundation";
import Tableau from "./Tableau";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { autoMove, createGame, GameProvider } from "../game";
import { useCallback, useState } from "react";
import { Action } from "../lib/flow";

const GameContainer = styled.div`
  display: grid;
  padding: 0 32px;
  margin-top: 32px;
  gap: 32px;

  justify-content: space-between;

  grid-template-areas:
    "hand     foundation"
    "tableau  tableau";
`;

const Button = styled.button`
  box-shadow: 0 -4px 0px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f1f7ee;

  border: none;
  padding: 4px 12px;

  cursor: pointer;

  font-family: "Roboto", serif;
  font-weight: 500;
  font-size: 17px;
`;

interface History<T> {
  present: T;
  undo: () => void;
  dispatch: (newState: Action<T>) => void;
}

interface HistoryState<T> {
  present: T;
  past: Array<T>;
}

function createHistory<T>(present: T): HistoryState<T> {
  return {
    present,
    past: [],
  };
}

function unHistory<T>([history, setHistory]: [
  HistoryState<T>,
  (action: Action<HistoryState<T>>) => void
]): History<T> {
  const { present } = history;

  const dispatch = (action: Action<T>) =>
    setHistory(({ present, past }) => ({
      present: action(present),
      past: [present, ...past],
    }));

  const undo = () => {
    if (history.past.length === 0) return;
    setHistory(({ past: [present, ...past] }) => ({ present, past }));
  };

  return {
    present,
    dispatch,
    undo,
  };
}

export default function Game() {
  const history = useState(createHistory(createGame()));
  const { present: state, dispatch, undo } = unHistory(history);

  const onReset = useCallback(() => dispatch(() => createGame()), [dispatch]);
  const onAutoMove = useCallback(() => dispatch(autoMove), [dispatch]);

  return (
    <GameProvider value={{ state, dispatch }}>
      <Global
        styles={css`
          html,
          body {
            font-family: Roboto, sans-serif;
            background-color: #368054;
          }
        `}
      />

      <DndProvider backend={HTML5Backend}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: stretch;
          `}
        >
          <div
            css={css`
              padding: 0 32px;
              margin-top: 16px;
              display: flex;
              gap: 8px;
              align-items: center;
            `}
          >
            <h1
              css={css`
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.7rem;
                font-weight: 800;
                font-family: Roboto Slab;
                margin: 0;
                padding: 0;
              `}
            >
              Solitaire{" "}
              <span
                css={css`
                  font-size: 1rem;
                `}
              >
                v6.6.6
              </span>
            </h1>
            <div css={{ flex: 1 }} />
            <Button onClick={() => onAutoMove()}>Auto-Move</Button>
            <Button onClick={() => undo()}>Undo</Button>
            <Button onClick={onReset}>Reset</Button>
          </div>
          <GameContainer>
            <div css={{ gridArea: "hand" }}>
              <Hand />
            </div>
            <div css={{ gridArea: "foundation" }}>
              <Foundation />
            </div>
            <div css={{ gridArea: "tableau" }}>
              <Tableau />
            </div>
          </GameContainer>
        </div>
      </DndProvider>
    </GameProvider>
  );
}
