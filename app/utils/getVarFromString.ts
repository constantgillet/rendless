/**
 * Get the value of a variable from a string, the var is between {{ and }}
 * @param value
 */
export const getVarFromString = (value: string) => {
  const matches = value.match(/{{(.*?)}}/);
  return matches ? matches[1] : undefined;
};
