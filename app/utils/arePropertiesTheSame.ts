import { ValueType } from "~/components/PropertiesPanel";

/**
 * Checks if all properties have the same value
 * @param properties
 * @returns boolean
 */
export const arePropertiesTheSame = (properties: ValueType[]) => {
  return properties.every((property) => {
    return property.value === properties[0].value;
  });
};
