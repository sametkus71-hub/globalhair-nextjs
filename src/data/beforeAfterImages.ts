export interface BeforeAfterImage {
  id: number;
  patientId: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
}

// 4x2 grid: positions 1-4 (top row), 5-8 (bottom row)
// Top row: BEFORE images, Bottom row: AFTER images
export const BEFORE_AFTER_IMAGES: BeforeAfterImage[] = [
  {
    id: 1,
    patientId: "patient-001",
    beforeImage: "https://GlobalHair.b-cdn.net/4.jpeg",
    afterImage: "https://GlobalHair.b-cdn.net/Global_Hair22614.jpg",
    beforeAlt: "Hair transplant patient before treatment - frontal view",
    afterAlt: "Hair transplant patient after treatment - frontal view"
  },
  {
    id: 2,
    patientId: "patient-002", 
    beforeImage: "https://GlobalHair.b-cdn.net/6.jpeg",
    afterImage: "https://GlobalHair.b-cdn.net/Global_Hair22838%20(1).jpg",
    beforeAlt: "Hair transplant procedure planning - hairline design and graft placement markings",
    afterAlt: "Hair transplant final result - natural hairline restoration complete"
  },
  {
    id: 3,
    patientId: "patient-003",
    beforeImage: "https://GlobalHair.b-cdn.net/DSC09673-min.JPG", 
    afterImage: "https://GlobalHair.b-cdn.net/Global_Hair23975-min.jpg",
    beforeAlt: "Hair transplant patient before treatment - crown area",
    afterAlt: "Hair transplant patient after treatment - crown area"
  },
  {
    id: 4,
    patientId: "patient-004",
    beforeImage: "https://GlobalHair.b-cdn.net/3%20(1).jpeg",
    afterImage: "https://GlobalHair.b-cdn.net/Global_Hair23094%20(1).jpg", 
    beforeAlt: "Hair transplant patient before treatment - profile view showing receding hairline",
    afterAlt: "Hair transplant patient after treatment - frontal view with restored natural hairline"
  },
  {
    id: 5,
    patientId: "patient-005",
    beforeImage: "https://GlobalHair.b-cdn.net/Foto%2021-04-2021%2020%2014%2054%20(1).jpg",
    afterImage: "https://GlobalHair.b-cdn.net/Global_Hair23162%20(1).jpg",
    beforeAlt: "Hair transplant patient before treatment - crown area hair loss",
    afterAlt: "Hair transplant patient after treatment - full hair restoration with natural hairline"
  },
  {
    id: 6,
    patientId: "patient-006", 
    beforeImage: "https://GlobalHair.b-cdn.net/DSC05062-min.JPG",
    afterImage: "https://GlobalHair.b-cdn.net/Global_Hair23542%20(1).jpg",
    beforeAlt: "Hair transplant patient before treatment - back view",
    afterAlt: "Hair transplant patient after treatment - back view"
  },
  {
    id: 7,
    patientId: "patient-007",
    beforeImage: "https://GlobalHair.b-cdn.net/DSC02689%20(1).png",
    afterImage: "https://GlobalHair.b-cdn.net/Global_Hair23605.jpg",
    beforeAlt: "Hair transplant patient before treatment - significant crown and frontal hair loss",
    afterAlt: "Hair transplant patient after treatment - complete hair restoration with natural density"
  },
  {
    id: 8,
    patientId: "patient-008",
    beforeImage: "/lovable-uploads/008c1f64-92b4-4871-a49b-7460adabfdfe.png",
    afterImage: "/lovable-uploads/1f2d1b48-9182-4a41-b281-6e5aba856d87.png", 
    beforeAlt: "Hair transplant procedure in progress - graft implantation process",
    afterAlt: "Hair transplant final result - complete hairline and density restoration"
  }
];

// Get all image paths for preloading
export const getAllImagePaths = (): string[] => {
  const paths: string[] = [];
  BEFORE_AFTER_IMAGES.forEach(item => {
    paths.push(item.beforeImage);
    paths.push(item.afterImage);
  });
  return paths;
};