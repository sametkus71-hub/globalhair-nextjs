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

// Placeholder videos - user will provide real CDN URLs
export const VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    title: 'FUE Procedure Overview',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 8,
    description: 'Short overview of the FUE hair transplant procedure'
  },
  {
    id: 'video-2', 
    title: 'Hairline Design Process',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 7,
    description: 'How we design natural hairlines for each patient'
  },
  {
    id: 'video-3',
    title: 'Graft Extraction Technique',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 9,
    description: 'Advanced graft extraction techniques for optimal results'
  },
  {
    id: 'video-4',
    title: 'Implantation Process',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 8,
    description: 'Precise graft implantation for natural results'
  },
  {
    id: 'video-5',
    title: 'Recovery Timeline',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 6,
    description: 'What to expect during recovery and healing'
  },
  {
    id: 'video-6',
    title: 'Results Timeline',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 10,
    description: 'Hair growth timeline from procedure to final results'
  },
  {
    id: 'video-7',
    title: 'Patient Consultation',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 7,
    description: 'Comprehensive patient consultation process'
  },
  {
    id: 'video-8',
    title: 'Clinic Tour',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 9,
    description: 'Tour of our state-of-the-art clinic facilities'
  },
  {
    id: 'video-9',
    title: 'Aftercare Instructions',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 8,
    description: 'Important aftercare instructions for best results'
  },
  {
    id: 'video-10',
    title: 'Technology Overview',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder.mp4', // Will be replaced with CDN URL
    duration: 7,
    description: 'Advanced technology used in our procedures'
  }
];