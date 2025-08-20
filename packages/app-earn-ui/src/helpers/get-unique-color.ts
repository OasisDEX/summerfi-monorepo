import uniqolor from 'uniqolor'

/**
 * @description Generates a unique color for a given string
 * @param colorString - The string to generate a color for
 * @param options - The options for the color generation
 * @param options.saturation - The saturation range for the color
 * @param options.lightness - The lightness range for the color
 * @param options.format - The format of the color
 * @returns A unique color in hex format
 */
export const getUniqueColor = (
  colorString: string,
  options: {
    saturation?: [number, number]
    lightness?: [number, number]
    format?: 'hex' | 'rgb'
  } = {
    saturation: [35, 90],
    lightness: [55, 70],
    format: 'hex',
  },
): string => uniqolor(colorString, options).color
