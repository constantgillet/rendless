import { ValueType } from "~/components/PropertiesPanel";

export const groupBySameValue = (properties: ValueType[]) => {
  //Group by same value and  return array of objects with elementIds and value
  const colors = properties.reduce((acc, property) => {
    const color = property.value;

    const index = acc?.findIndex((item) => item.value === color) ?? -1;

    if (index === -1) {
      acc.push({ elementIds: [property.nodeId], value: color });
    } else {
      acc[index].elementIds.push(property.nodeId);
    }

    return acc;
  }, [] as { elementIds: string[]; value: string }[]);

  return colors;
};
