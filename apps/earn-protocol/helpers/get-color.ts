import uniqolor from 'uniqolor'

export const getColor = (colorString: string) =>
  uniqolor(colorString, {
    saturation: [35, 90],
    lightness: [55, 70],
    format: 'hex',
  }).color
