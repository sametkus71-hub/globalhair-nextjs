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
    beforeImage: "/lovable-uploads/b3fbef14-c9eb-46dc-81fb-0ea21179e4a2.png",
    afterImage: "/lovable-uploads/5a1f8347-921e-4017-9f94-9443b6f78a19.png",
    beforeAlt: "Hair transplant procedure planning - hairline design and graft placement markings",
    afterAlt: "Hair transplant final result - natural hairline restoration complete"
  },
  {
    id: 3,
    patientId: "patient-003",
    beforeImage: "/lovable-uploads/230b8ef0-b4c0-4aee-af54-df5e7f2a6201.png", 
    afterImage: "/lovable-uploads/2b9e0bad-9af2-418e-9da5-61251fda9bf5.png",
    beforeAlt: "Hair transplant patient before treatment - crown area",
    afterAlt: "Hair transplant patient after treatment - crown area"
  },
  {
    id: 4,
    patientId: "patient-004",
    beforeImage: "/lovable-uploads/974fb0eb-036f-4f62-af0d-7943b4eb0365.png",
    afterImage: "/lovable-uploads/7991a444-0c04-42f9-a4b8-4afd8e3f3306.png", 
    beforeAlt: "Hair transplant patient before treatment - profile view showing receding hairline",
    afterAlt: "Hair transplant patient after treatment - frontal view with restored natural hairline"
  },
  {
    id: 5,
    patientId: "patient-005",
    beforeImage: "/lovable-uploads/19e4f564-f73b-4364-9a9b-3d3d91a23659.png",
    afterImage: "/lovable-uploads/90ac62d8-814a-497f-87b2-3b13fc323e06.png",
    beforeAlt: "Hair transplant patient before treatment - crown area hair loss",
    afterAlt: "Hair transplant patient after treatment - full hair restoration with natural hairline"
  },
  {
    id: 6,
    patientId: "patient-006", 
    beforeImage: "/lovable-uploads/54d5ba6c-7e60-4b15-8638-069720030225.png",
    afterImage: "/lovable-uploads/75185e09-91f9-4292-90d7-fd4371d2ab23.png",
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