import { useEditorStore } from "../EditorStore";
import { getElementVariables } from "./getElementVariables";

/**
 * Update the variables of the elements with the new variable
 * @param elementIds
 * @param propertyName
 * @param variableName
 */
export const updateElementsVariables = (
  elementIds: string[],
  propertyName: string,
  variableName: string
) => {
  const updateElements = useEditorStore.getState().updateElements;

  updateElements(
    elementIds.map((elementId) => {
      const currentVariables = getElementVariables(elementId);

      //Create new vaiables with the new variable if it doesn't exist
      const newVariablesWithoutProperty = currentVariables.filter(
        (variable) => variable.property !== propertyName
      );

      const newVariables = [
        ...newVariablesWithoutProperty,
        {
          property: propertyName,
          name: variableName,
        },
      ];

      return {
        id: elementId,
        variables: newVariables,
      };
    }),
    true
  );
};
