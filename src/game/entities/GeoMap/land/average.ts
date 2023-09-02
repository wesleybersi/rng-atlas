function getAverageColor(color1: number, color2: number): number {
  const red1 = (color1 >> 16) & 0xff;
  const green1 = (color1 >> 8) & 0xff;
  const blue1 = color1 & 0xff;

  const red2 = (color2 >> 16) & 0xff;
  const green2 = (color2 >> 8) & 0xff;
  const blue2 = color2 & 0xff;

  const averageRed = Math.round((red1 + red2) / 2);
  const averageGreen = Math.round((green1 + green2) / 2);
  const averageBlue = Math.round((blue1 + blue2) / 2);

  const averageColor = (averageRed << 16) | (averageGreen << 8) | averageBlue;

  return 0x1000000 + averageColor; // Add the "0x" prefix
}

export default getAverageColor;
export function getOverlayColor(
  color1: number,
  color2: number,
  amount1: number,
  amount2: number
): number {
  const red1 = (color1 >> 16) & 0xff;
  const green1 = (color1 >> 8) & 0xff;
  const blue1 = color1 & 0xff;

  const red2 = (color2 >> 16) & 0xff;
  const green2 = (color2 >> 8) & 0xff;
  const blue2 = color2 & 0xff;

  const blendedRed = Math.round(red1 * (1 - amount2) + red2 * amount2);
  const blendedGreen = Math.round(green1 * (1 - amount2) + green2 * amount2);
  const blendedBlue = Math.round(blue1 * (1 - amount2) + blue2 * amount2);

  const overlayRed = Math.round(blendedRed * (1 - amount1) + red1 * amount1);
  const overlayGreen = Math.round(
    blendedGreen * (1 - amount1) + green1 * amount1
  );
  const overlayBlue = Math.round(blendedBlue * (1 - amount1) + blue1 * amount1);

  const overlayColor = (overlayRed << 16) | (overlayGreen << 8) | overlayBlue;

  return overlayColor;
}
