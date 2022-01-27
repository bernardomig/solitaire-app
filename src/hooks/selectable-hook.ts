import {
  createContext,
  createElement,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type SelectableId = any;

const SelectableContext = createContext<{
  selected: SelectableId | null;
  setSelected: React.Dispatch<React.SetStateAction<SelectableId | null>>;
}>(null!);

export const SelectableProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState(null);
  return createElement(SelectableContext.Provider, {
    value: { selected, setSelected },
  }, children);
};

export function useSelectable() {
  const { selected, setSelected } = useContext(SelectableContext);

  const isSelected = useCallback(
    (id: SelectableId) => selected !== null && selected === id,
    [selected],
  );

  const select = useCallback((id: SelectableId) => setSelected(id), [
    setSelected,
  ]);

  const unSelect = useCallback((id: SelectableId) => setSelected(null), [
    setSelected,
  ]);

  return { isSelected, select, unSelect };
}
