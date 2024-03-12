import { getElementVariables } from "~/stores/actions/getElementVariables";

/**
 * Extracts the variables from the element and exclde the one with the propertyVariableExclued
 * @param propertyVariableExclued
 * @param elementId
 * @returns
 */
export const getVariablesWithoutProperty = (
  propertyVariableExclued: string,
  elementId: string
) => {
  const currentVariables = getElementVariables(elementId);

  return currentVariables.filter(
    (variable) => variable.property !== propertyVariableExclued
  );
};
