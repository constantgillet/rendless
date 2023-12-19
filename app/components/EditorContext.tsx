import { createContext, useContext, useState } from "react";

type EditorContextType = {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<null>>;
  tree: Array<string>;
  setTree: React.Dispatch<React.SetStateAction<Array<string>>>;
};

const EditorContext = createContext<EditorContextType>({
  selected: null,
  setSelected: () => {},
  tree: [],
  setTree: () => {},
});

type EditorContextProviderProps = {
  children: React.ReactNode;
};

export const EditorContextProvider = ({
  children,
}: EditorContextProviderProps) => {
  const [selected, setSelected] = useState(null);
  const [tree, setTree] = useState<Array<string>>([]);

  return (
    <EditorContext.Provider value={{ selected, setSelected, tree, setTree }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within a EditorContextProvider");
  }

  const resetSelect = () => {
    context.setSelected(null);
  };

  return {
    selected: context.selected,
    resetSelect,
  };
};
