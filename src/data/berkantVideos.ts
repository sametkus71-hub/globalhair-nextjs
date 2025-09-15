// Berkant founder videos - paired subbed/unsubbed versions
// Subbed videos are shown in the reviews grid (muted autoplay)
// Unsubbed videos are shown in the mission page (unmuted, full screen)

export interface BerkantVideoItem {
  id: string;
  title: string;
  subbedUrl: string; // With subtitles, compressed, for reviews grid
  unsubbedUrl: string; // Without subtitles, for mission page
  thumbnail: string; // Video frame thumbnail
  duration: number; // Duration in seconds
  description: string;
}

// Berkant founder videos from GlobalHair CDN
export const BERKANT_VIDEOS: BerkantVideoItem[] = [
  {
    id: 'berkant-1',
    title: 'Berkant - Founder Story 1',
    subbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B1%20SUB%20-%20COMPRESS.mp4',
    unsubbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B1%20-%20COMPRESS.mp4',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B1%20SUB%20-%20COMPRESS.mp4#t=1',
    duration: 45,
    description: 'Founder Berkant Dural shares his vision and mission'
  },
  {
    id: 'berkant-2', 
    title: 'Berkant - Founder Story 2',
    subbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B2%20SUB%20-%20COMPRESS.mp4',
    unsubbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B2%20-%20COMPRESS.mp4',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B2%20SUB%20-%20COMPRESS.mp4#t=1',
    duration: 50,
    description: 'The journey behind GlobalHair methodology'
  },
  {
    id: 'berkant-3',
    title: 'Berkant - Founder Story 3', 
    subbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B3%20SUB%20-%20COMPRESS.mp4',
    unsubbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B3%20-%20COMPRESS.mp4',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B3%20SUB%20-%20COMPRESS.mp4#t=1',
    duration: 40,
    description: 'Innovation in hair restoration technology'
  },
  {
    id: 'berkant-4',
    title: 'Berkant - Founder Story 4',
    subbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B4%20SUB%20-%20COMPRESS.mp4',
    unsubbedUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B4%20-%20COMPRESS.mp4',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B4%20SUB%20-%20COMPRESS.mp4#t=1',
    duration: 55,
    description: 'The future of personalized hair treatments'
  }
];

// Helper function to get unsubbed video by ID
export const getBerkantVideoById = (id: string): BerkantVideoItem | undefined => {
  return BERKANT_VIDEOS.find(video => video.id === id);
};