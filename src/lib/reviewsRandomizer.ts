import { QUOTES } from '@/data/reviewsQuotes';
import { BEFORE_AFTER_ITEMS } from '@/data/reviewsBeforeAfter';
import { VIDEOS } from '@/data/reviewsVideos';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';

export type ContentType = 'quote' | 'before-after' | 'video' | 'berkant-video';

export interface GridItem {
  id: string;
  type: ContentType;
  rowSpan: 1 | 2;
  data: any; // Will be typed based on content type
}

// Grid layout structure (18 items total)
// 3 vertical videos: left (rows 2-3), right (rows 3-4), left (rows 5-6)
const GRID_LAYOUT: Array<{ rowSpan: 1 | 2; contentType?: 'video-only' | 'small-only' }> = [
  { rowSpan: 1, contentType: 'small-only' }, // Item 1 - Row 1, Col 1
  { rowSpan: 1, contentType: 'small-only' }, // Item 2 - Row 1, Col 2
  { rowSpan: 1, contentType: 'small-only' }, // Item 3 - Row 1, Col 3
  { rowSpan: 2, contentType: 'video-only' }, // Item 4 - Rows 2-3, Col 1 (left)
  { rowSpan: 1, contentType: 'small-only' }, // Item 5 - Row 2, Col 2
  { rowSpan: 1, contentType: 'small-only' }, // Item 6 - Row 2, Col 3
  { rowSpan: 1, contentType: 'small-only' }, // Item 7 - Row 3, Col 2
  { rowSpan: 2, contentType: 'video-only' }, // Item 8 - Rows 3-4, Col 3 (right)
  { rowSpan: 1, contentType: 'small-only' }, // Item 9 - Row 4, Col 1
  { rowSpan: 1, contentType: 'small-only' }, // Item 10 - Row 4, Col 2
  { rowSpan: 2, contentType: 'video-only' }, // Item 11 - Rows 5-6, Col 1 (left)
  { rowSpan: 1, contentType: 'small-only' }, // Item 12 - Row 5, Col 2
  { rowSpan: 1, contentType: 'small-only' }, // Item 13 - Row 5, Col 3
  { rowSpan: 1, contentType: 'small-only' }, // Item 14 - Row 6, Col 2
  { rowSpan: 1, contentType: 'small-only' }, // Item 15 - Row 6, Col 3
  { rowSpan: 1, contentType: 'small-only' }, // Item 16 - Row 7, Col 1
  { rowSpan: 1, contentType: 'small-only' }, // Item 17 - Row 7, Col 2
  { rowSpan: 1, contentType: 'small-only' }  // Item 18 - Row 7, Col 3
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
  const shuffledBeforeAfter = shuffleArray(BEFORE_AFTER_ITEMS);
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
  const selectedBeforeAfter = shuffleArray(shuffledBeforeAfter);

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