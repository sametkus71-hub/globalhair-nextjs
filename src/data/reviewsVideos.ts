// Video items for the reviews grid
// Videos auto-play muted and loop, clickable to open full screen
// Maximum 3-4 videos per grid to avoid performance issues

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string; // Fallback thumbnail image
  videoUrl: string; // CDN URL for the video
  duration: number; // Duration in seconds
  description?: string; // Optional description for full screen view
}

// Real testimonial videos from GlobalHair CDN
export const VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    title: 'Patient Testimonial 1',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_01.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_01.mp4',
    duration: 30,
    description: 'Real patient sharing their hair transplant experience'
  },
  {
    id: 'video-2', 
    title: 'Patient Testimonial 2',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_02.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_02.mp4',
    duration: 30,
    description: 'Hair transplant results and patient satisfaction'
  },
  {
    id: 'video-3',
    title: 'Patient Testimonial 3',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_03.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_03.mp4',
    duration: 30,
    description: 'Before and after transformation story'
  },
  {
    id: 'video-4',
    title: 'Patient Testimonial 4',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_04.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_04.mp4',
    duration: 30,
    description: 'Patient journey and final results'
  },
  {
    id: 'video-5',
    title: 'Patient Testimonial 5',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_05.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_05.mp4',
    duration: 30,
    description: 'Recovery experience and outcome'
  },
  {
    id: 'video-6',
    title: 'Patient Testimonial 6',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_06.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_06.mp4',
    duration: 30,
    description: 'Hair transplant success story'
  },
  {
    id: 'video-7',
    title: 'Patient Testimonial 7',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_07.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_07.mp4',
    duration: 30,
    description: 'Natural results and patient feedback'
  },
  {
    id: 'video-8',
    title: 'Patient Testimonial 8',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_08.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_08.mp4',
    duration: 30,
    description: 'Life-changing hair restoration results'
  },
  {
    id: 'video-9',
    title: 'Patient Testimonial 9',
    thumbnail: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_09.mp4#t=1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Testimonials/V1_Reviews_09.mp4',
    duration: 30,
    description: 'Complete transformation testimonial'
  }
];