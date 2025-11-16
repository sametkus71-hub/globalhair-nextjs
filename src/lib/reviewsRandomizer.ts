import { QUOTES } from '@/data/reviewsQuotes';
import { BEFORE_AFTER_ITEMS } from '@/data/reviewsBeforeAfter';
import { VIDEOS } from '@/data/reviewsVideos';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';

export type ContentType = 'quote' | 'before-after' | 'video' | 'berkant-video';

export interface GridItem {
  id: string;
  type: ContentType;
  width: 1 | 2;  // Column span
  height: 1 | 2; // Row span
  data: any; // Will be typed based on content type
}

// Grid layout structure - Instagram-style with mixed sizes
// Includes 1×1 (small), 1×2 (tall), and 2×2 (big square) items only
const GRID_LAYOUT: Array<{ width: 1 | 2; height: 1 | 2; contentType?: 'video-only' | 'small-only' }> = [
  // Pattern 1: Big square video + small items
  { width: 2, height: 2, contentType: 'video-only' },  // Big square video
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 2: Column of 3 small items
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 3: Tall video + 2 small
  { width: 1, height: 2, contentType: 'video-only' },  // Tall video
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 4: Big square + small
  { width: 2, height: 2, contentType: 'small-only' },  // Big square
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 5: 3 small stacked
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 6: Tall video + small items
  { width: 1, height: 2, contentType: 'video-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 7: Big square video + tall
  { width: 2, height: 2, contentType: 'video-only' },  // Big square
  { width: 1, height: 2, contentType: 'small-only' },  // Tall
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 8: Small column
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 9: Tall video + small items
  { width: 1, height: 2, contentType: 'video-only' },  // Tall
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  
  // Pattern 10: Big square + small
  { width: 2, height: 2, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' },
  { width: 1, height: 1, contentType: 'small-only' }
];

// Shuffle array utility
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate random grid layout
export const generateRandomGrid = (): GridItem[] => {
  // Shuffle all content pools
  const shuffledQuotes = shuffleArray(QUOTES);
  
  // Shuffle all content except priority before/after image
  const shuffledPatientVideos = shuffleArray(VIDEOS); // Patient testimonials
  const shuffledBerkantVideos = shuffleArray(BERKANT_VIDEOS); // Berkant videos

  // Find all 1x1 positions (small-only slots)
  const smallPositions = GRID_LAYOUT
    .map((layout, index) => ({ layout, index }))
    .filter(({ layout }) => layout.contentType === 'small-only')
    .map(({ index }) => index);

  // Randomly select 4 positions for quotes
  const shuffledPositions = shuffleArray(smallPositions);
  const quotePositions = new Set(shuffledPositions.slice(0, Math.min(4, shuffledQuotes.length)));

  // Select content
  const selectedQuotes = shuffledQuotes.slice(0, Math.min(4, shuffledQuotes.length));
  
  // Calculate how many before/after images we need
  const beforeAfterSlots = GRID_LAYOUT.length - 6 - Math.min(4, shuffledQuotes.length); // 6 video slots, up to 4 quote slots
  
  // Ensure priority image is included, then fill with random others
  const priorityImage = BEFORE_AFTER_ITEMS.find(item => 
    item.image.includes('FD%20after.jpg')
  );
  const otherImages = shuffleArray(BEFORE_AFTER_ITEMS.filter(item => 
    !item.image.includes('FD%20after.jpg')
  ));
  
  // Create selection pool: priority image + random others, then shuffle all
  const beforeAfterPool = priorityImage 
    ? [priorityImage, ...otherImages.slice(0, Math.max(0, beforeAfterSlots - 1))]
    : otherImages.slice(0, beforeAfterSlots);
  
  const selectedBeforeAfter = shuffleArray(beforeAfterPool);

  // Build grid items with position-specific assignment
  let quoteIndex = 0;
  let beforeAfterIndex = 0;
  let patientVideoIndex = 0;

  const gridItems: GridItem[] = GRID_LAYOUT.map((layout, index) => {
    let content: { type: ContentType; data: any };

    if (layout.contentType === 'video-only') {
      // Video slot - First slot (position 4) always gets Berkant video
      if (index === 3) { // Position 4 (0-indexed = 3)
        const berkantVideo = shuffledBerkantVideos[0]; // Pick first shuffled Berkant video
        content = {
          type: 'berkant-video',
          data: {
            ...berkantVideo,
            // Berkant videos now use compressed WebM format
            videoUrl: berkantVideo.videoUrl,
            thumbnail: berkantVideo.thumbnail
          }
        };
      } else {
        // Other video slots use patient testimonials
        const videoData = shuffledPatientVideos.length > 0 
          ? shuffledPatientVideos[patientVideoIndex % shuffledPatientVideos.length]
          : selectedBeforeAfter[beforeAfterIndex % Math.max(1, selectedBeforeAfter.length)];
        
        content = {
          type: shuffledPatientVideos.length > 0 ? 'video' : 'before-after',
          data: videoData
        };
        patientVideoIndex++;
      }
    } else if (quotePositions.has(index)) {
      // Quote position
      content = {
        type: 'quote',
        data: selectedQuotes[quoteIndex % selectedQuotes.length]
      };
      quoteIndex++;
    } else {
      // Before/after position
      content = {
        type: 'before-after',
        data: selectedBeforeAfter[beforeAfterIndex % Math.max(1, selectedBeforeAfter.length)]
      };
      beforeAfterIndex++;
    }

    return {
      id: `item-${index}-${content?.data?.id ?? index}`,
      type: content.type,
      width: layout.width,
      height: layout.height,
      data: content.data
    };
  });

  return gridItems;
};


// Get cycling groups for before/after items (groups of 2)
export const getBeforeAfterCyclingGroups = (gridItems: GridItem[]): number[][] => {
  const beforeAfterIndices = gridItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'before-after')
    .map(({ index }) => index);
  
  const groups: number[][] = [];
  
  for (let i = 0; i < beforeAfterIndices.length; i += 2) {
    const group = beforeAfterIndices.slice(i, i + 2);
    groups.push(group);
  }
  
  return groups;
};