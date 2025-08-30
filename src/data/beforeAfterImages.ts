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
    beforeImage: "/lovable-uploads/04aab7a8-e1ff-45f4-a726-51acc3e02a41.png",
    afterImage: "/lovable-uploads/179a6a5e-ef1b-4126-a92f-5314abdc9aa3.png",
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
    beforeImage: "/lovable-uploads/30181b08-9d4b-4553-98aa-04bd671930be.png",
    afterImage: "/lovable-uploads/36b7add7-c0c6-4b53-a0bd-41854d1270e7.png", 
    beforeAlt: "Hair transplant patient before treatment - hairline",
    afterAlt: "Hair transplant patient after treatment - hairline"
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
    beforeImage: "/lovable-uploads/96425c30-bd66-43e5-be1c-2102821e76f1.png",
    afterImage: "/lovable-uploads/99d7d19a-5297-4bd5-94a9-63b3442aece0.png",
    beforeAlt: "Hair transplant patient before treatment - overall density",
    afterAlt: "Hair transplant patient after treatment - overall density"
  },
  {
    id: 8,
    patientId: "patient-008",
    beforeImage: "/lovable-uploads/9a5567ac-b6d3-4a0b-98db-aefd6f1d3e21.png",
    afterImage: "/lovable-uploads/a593ff6b-3d96-407a-a55c-598bbc56df9b.png", 
    beforeAlt: "Hair transplant patient before treatment - full head",
    afterAlt: "Hair transplant patient after treatment - full head"
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