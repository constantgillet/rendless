import type { ValueType } from "~/components/PropertiesPanel";

/**
 * Check if properties have values
 * @param properties - array of properties
 * @returns boolean
 */
export const propertiesHaveValues = (properties: ValueType[]) => {
	return properties.some((property) => property.value !== null);
};
