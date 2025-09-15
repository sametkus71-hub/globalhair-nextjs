export interface GridImage {
  id: number;
  src: string;
  alt: string;
}

export const GRID_IMAGES: GridImage[] = [
  {
    id: 1,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-02323.png",
    alt: "Hair transplant result - Patient 1"
  },
  {
    id: 2,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-343-00).png",
    alt: "Hair transplant result - Patient 2"
  },
  {
    id: 3,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-07-12).png",
    alt: "Hair transplant result - Patient 3"
  },
  {
    id: 4,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-00234324.png",
    alt: "Hair transplant result - Patient 4"
  },
  {
    id: 5,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-00-00)643646.png",
    alt: "Hair transplant result - Patient 5"
  },
  {
    id: 6,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-00-00)344.png",
    alt: "Hair transplant result - Patient 6"
  },
  {
    id: 7,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-00-00)22.png",
    alt: "Hair transplant result - Patient 7"
  },
  {
    id: 8,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-00-00)123421.png",
    alt: "Hair transplant result - Patient 8"
  },
  {
    id: 9,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-00-00)123.png",
    alt: "Hair transplant result - Patient 9"
  },
  {
    id: 10,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/Global_Hair24319%20(0-00-00-00)11111.png",
    alt: "Hair transplant result - Patient 10"
  },
  {
    id: 11,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/f84da74b-32f1-4e87-9308-88d5b63541f8.png",
    alt: "Hair transplant result - Patient 11"
  },
  {
    id: 12,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/17edfbed-ee54-4614-a031-02e04c4d2602.png",
    alt: "Hair transplant result - Patient 12"
  },
  {
    id: 13,
    src: "https://GlobalHair.b-cdn.net/Haartransplantatie%20-%20Grid%20(after%20img)/0db111bb-1849-488f-a1a8-314816693b9f.png",
    alt: "Hair transplant result - Patient 13"
  }
];

export const getAllImagePaths = (): string[] => {
  return GRID_IMAGES.map(image => image.src);
};

// Fisher-Yates shuffle algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};