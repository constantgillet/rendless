import { Badge, Callout } from "@radix-ui/themes";
import { PanelGroup } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { Tree, useEditorStore } from "~/stores/EditorStore";
import { useMemo } from "react";
import { css } from "styled-system/css";
import toast from "react-hot-toast";

const getAllVariablesList = (tree: Tree) => {
  const variableList: Array<string> = [];

  const findVariables = (node: Tree) => {
    if (node.variables) {
      node.variables.forEach((variable) => {
        if (!variableList.includes(variable.name)) {
          variableList.push(variable.name);
        }
      });
    }

    if (node.children) {
      node.children.forEach((child) => {
        findVariables(child);
      });
    }
  };

  findVariables(tree);

  return variableList;
};

export const VariablesFoundIndicator = () => {
  const tree = useEditorStore((state) => state.tree);

  const variables = useMemo(() => getAllVariablesList(tree), [tree]);

  const onClickCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toast.success(`Copied ${variable} to clipboard`);
  };

  return (
    <PanelGroup title="Templates Variables">
      <Callout.Root size={"1"} color="gray">
        <Callout.Icon>
          <Icon name="info" />
        </Callout.Icon>
        <Callout.Text>
          You can use these variables in your template
        </Callout.Text>
      </Callout.Root>
      <div
        className={css({
          display: "flex",
          gap: "4px",
          width: "100%",
          flexWrap: "wrap",
        })}
      >
        {variables.map((variable) => (
          <Badge key={variable} size="1" color="green">
            {variable}
            <Icon
              name="copy"
              size="lg"
              className={css({
                cursor: "pointer",
              })}
              onClick={() => onClickCopyVariable(variable)}
            />
          </Badge>
        ))}
      </div>
    </PanelGroup>
  );
};
