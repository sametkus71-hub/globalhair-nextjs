export interface TestimonialReview {
  id: string;
  name: string;
  photo: string;
  testimonial: string;
  isLarge?: boolean;
}

export const testimonialReviews: TestimonialReview[] = [
  {
    id: '1',
    name: 'Michael Anderson',
    photo: '/lovable-uploads/008c1f64-92b4-4871-a49b-7460adabfdfe.png',
    testimonial: 'The results exceeded my expectations. The team was professional and caring throughout the entire process.',
  },
  {
    id: '2',
    name: 'David Chen',
    photo: '/lovable-uploads/04aab7a8-e1ff-45f4-a726-51acc3e02a41.png',
    testimonial: 'Life-changing experience. I feel confident again!',
    isLarge: true,
  },
  {
    id: '3',
    name: 'Robert Williams',
    photo: '/lovable-uploads/096ed5af-55a0-4490-9d95-4203915c4ce2.png',
    testimonial: 'Outstanding service and incredible natural-looking results.',
  },
  {
    id: '4',
    name: 'James Thompson',
    photo: '/lovable-uploads/179a6a5e-ef1b-4126-a92f-5314abdc9aa3.png',
    testimonial: 'Best decision I ever made. The transformation is amazing.',
  },
  {
    id: '5',
    name: 'Daniel Martinez',
    photo: '/lovable-uploads/19e4f564-f73b-4364-9a9b-3d3d91a23659.png',
    testimonial: 'Professional, caring, and the results speak for themselves. Highly recommend!',
    isLarge: true,
  },
  {
    id: '6',
    name: 'Christopher Lee',
    photo: '/lovable-uploads/1c0a6d55-db05-4d05-a47b-e6dd814c6d62.png',
    testimonial: 'Natural looking results that boosted my confidence tremendously.',
  },
  {
    id: '7',
    name: 'Matthew Taylor',
    photo: '/lovable-uploads/1e4738b7-ae5c-4b74-bd8c-73364351bd6c.png',
    testimonial: 'The entire team made me feel comfortable. Amazing experience.',
  },
  {
    id: '8',
    name: 'Andrew Brown',
    photo: '/lovable-uploads/1f2d1b48-9182-4a41-b281-6e5aba856d87.png',
    testimonial: 'Incredible results! Worth every penny. The care and attention to detail was exceptional.',
    isLarge: true,
  },
  {
    id: '9',
    name: 'Joshua Davis',
    photo: '/lovable-uploads/230b8ef0-b4c0-4aee-af54-df5e7f2a6201.png',
    testimonial: 'Exceeded all my expectations. Truly professional service.',
  },
  {
    id: '10',
    name: 'Kevin Wilson',
    photo: '/lovable-uploads/2b9e0bad-9af2-418e-9da5-61251fda9bf5.png',
    testimonial: 'Fantastic experience from start to finish.',
  },
  {
    id: '11',
    name: 'Ryan Garcia',
    photo: '/lovable-uploads/30181b08-9d4b-4553-98aa-04bd671930be.png',
    testimonial: 'The transformation has been life-changing. I cannot thank the team enough for their expertise.',
  },
  {
    id: '12',
    name: 'Brandon Miller',
    photo: '/lovable-uploads/36b7add7-c0c6-4b53-a0bd-41854d1270e7.png',
    testimonial: 'Professional and caring staff with amazing results.',
    isLarge: true,
  },
];
