const vowels: string[] = ["a", "e", "i", "o", "u"];
const consonants: string[] = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export default function generateRandomCountryName(second?: boolean): string {
  const syllables: number = Math.floor(Math.random() * 3) + 2;
  let name = "";
  for (let i = 0; i < syllables; i++) {
    if (Math.random() < 0.5) {
      name += consonants[Math.floor(Math.random() * consonants.length)];
    }
    name += vowels[Math.floor(Math.random() * vowels.length)];
    name += consonants[Math.floor(Math.random() * consonants.length)];
  }

  let randomName = name.charAt(0).toUpperCase() + name.slice(1);
  if (!second && !Math.floor(Math.random() * 10)) {
    randomName += " " + generateRandomCountryName(true);
  } else if (!Math.floor(Math.random() * 100)) {
    randomName = "Neo " + randomName;
  }
  return randomName;
}
