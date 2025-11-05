import { QUOTES } from '@/data/reviewsQuotes';
import { BEFORE_AFTER_ITEMS } from '@/data/reviewsBeforeAfter';
import { VIDEOS } from '@/data/reviewsVideos';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';

export type ContentType = 'quote' | 'before-after' | 'video' | 'berkant-video';

export interface GridItem {
  id: string;
  type: ContentType;
  rowSpan: 1 | 2;
  colSpan: 1 | 2;
  data: any; // Will be typed based on content type
}

// Grid layout structure - 3 rows, infinite columns
// Some items span 2x2 for visual interest
const GRID_LAYOUT: Array<{ rowSpan: 1 | 2; colSpan: 1 | 2; contentType?: 'video-only' | 'small-only' | 'large' }> = [
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 2, colSpan: 2, contentType: 'video-only' }, // Large video
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 2, colSpan: 1, contentType: 'video-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 2, colSpan: 2, contentType: 'large' }, // Large before/after
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 2, colSpan: 1, contentType: 'video-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 2, colSpan: 2, contentType: 'video-only' }, // Large video
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 2, colSpan: 1, contentType: 'video-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' },
  { rowSpan: 1, colSpan: 1, contentType: 'small-only' }
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
  
  // Find large (2x2) positions
  const largePositions = GRID_LAYOUT
    .map((layout, index) => ({ layout, index }))
    .filter(({ layout }) => layout.contentType === 'large')
    .map(({ index }) => index);

  // Randomly select 4 positions for quotes
  const shuffledPositions = shuffleArray(smallPositions);
  const quotePositions = new Set(shuffledPositions.slice(0, Math.min(4, shuffledQuotes.length)));

  // Select content
  const selectedQuotes = shuffledQuotes.slice(0, Math.min(4, shuffledQuotes.length));
  
  // Calculate how many before/after images we need (including large slots)
  const videoSlots = GRID_LAYOUT.filter(l => l.contentType === 'video-only').length;
  const largeSlots = largePositions.length;
  const beforeAfterSlots = GRID_LAYOUT.length - videoSlots - Math.min(4, shuffledQuotes.length);
  
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
            // Use subbed version for reviews grid
            videoUrl: berkantVideo.subbedUrl,
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
    } else if (layout.contentType === 'large') {
      // Large slots can be before/after only
      content = {
        type: 'before-after',
        data: selectedBeforeAfter[beforeAfterIndex % Math.max(1, selectedBeforeAfter.length)]
      };
      beforeAfterIndex++;
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
      rowSpan: layout.rowSpan,
      colSpan: layout.colSpan,
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