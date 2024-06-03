import type { ValueType } from "~/components/PropertiesPanel";

export const groupBySameColor = (
  colorProperties: ValueType[],
  opacityProperties: ValueType[]
) => {
  //Group by same value and  return array of objects with elementIds and value
  const colors = colorProperties.reduce((acc, property, currentIndex) => {
    const color = property.value;

    const index =
      acc?.findIndex(
        (item) => item.value === color && opacityProperties[currentIndex].value
      ) ?? -1;

    if (index === -1) {
      acc.push({
        elementIds: [property.nodeId],
        value: color,
        opacity: opacityProperties[currentIndex].value,
        colorVariable: property.variableName,
        opacityVariable: opacityProperties[currentIndex].variableName,
      });
    } else {
      acc[index].elementIds.push(property.nodeId);
    }

    return acc;
  }, [] as { elementIds: string[]; value: string; opacity: number; colorVariable?: string; opacityVariable?: string }[]);

  return colors;
};
