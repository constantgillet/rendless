import { createContext, useContext, useState } from "react";

type EditorContextType = {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<null>>;
};

const EditorContext = createContext<EditorContextType>({
  selected: null,
  setSelected: () => {},
});

type EditorContextProviderProps = {
  children: React.ReactNode;
};

export const EditorContextProvider = ({
  children,
}: EditorContextProviderProps) => {
  const [selected, setSelected] = useState(null);

  return (
    <EditorContext.Provider value={{ selected, setSelected }}>
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
