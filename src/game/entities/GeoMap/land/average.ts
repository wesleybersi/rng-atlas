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
