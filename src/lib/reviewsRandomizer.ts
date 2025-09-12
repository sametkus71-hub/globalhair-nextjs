import { QUOTES } from '@/data/reviewsQuotes';
import { BEFORE_AFTER_ITEMS } from '@/data/reviewsBeforeAfter';
import { VIDEOS } from '@/data/reviewsVideos';

export type ContentType = 'quote' | 'before-after' | 'video';

export interface GridItem {
  id: string;
  type: ContentType;
  rowSpan: 1 | 2;
  data: any; // Will be typed based on content type
}

// Improved grid layout structure (18 items total)
// 3 vertical items (1x2) for videos only, positioned: left, right, center
const GRID_LAYOUT: Array<{ rowSpan: 1 | 2; contentType?: 'video-only' | 'small-only' }> = [
  { rowSpan: 1, contentType: 'small-only' }, // Item 1
  { rowSpan: 1, contentType: 'small-only' }, // Item 2  
  { rowSpan: 1, contentType: 'small-only' }, // Item 3
  { rowSpan: 2, contentType: 'video-only' }, // Item 4 (vertical - left)
  { rowSpan: 1, contentType: 'small-only' }, // Item 5
  { rowSpan: 2, contentType: 'video-only' }, // Item 6 (vertical - right)
  { rowSpan: 1, contentType: 'small-only' }, // Item 7
  { rowSpan: 1, contentType: 'small-only' }, // Item 8
  { rowSpan: 1, contentType: 'small-only' }, // Item 9
  { rowSpan: 1, contentType: 'small-only' }, // Item 10
  { rowSpan: 1, contentType: 'small-only' }, // Item 11
  { rowSpan: 1, contentType: 'small-only' }, // Item 12
  { rowSpan: 2, contentType: 'video-only' }, // Item 13 (vertical - center)
  { rowSpan: 1, contentType: 'small-only' }, // Item 14
  { rowSpan: 1, contentType: 'small-only' }, // Item 15
  { rowSpan: 1, contentType: 'small-only' }, // Item 16
  { rowSpan: 1, contentType: 'small-only' }, // Item 17
  { rowSpan: 1, contentType: 'small-only' }  // Item 18
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
  const shuffledVideos = shuffleArray(VIDEOS);
  
  // Fixed content distribution for new layout
  const totalItems = 18;
  const numVideos = 3; // Exactly 3 videos for the 3 vertical slots
  const maxQuotes = 4; // Maximum 4 quotes
  const numQuotes = Math.min(maxQuotes, Math.floor(Math.random() * 3) + 2); // 2-4 quotes
  const numBeforeAfter = totalItems - numVideos - numQuotes; // Remaining are before/after items
  
  // Create content pools for this grid
  const gridVideos = shuffledVideos.slice(0, numVideos);
  const gridBeforeAfter = shuffledBeforeAfter.slice(0, numBeforeAfter);
  const gridQuotes = shuffledQuotes.slice(0, numQuotes);
  
  // Separate content by type restrictions
  const videoContent = gridVideos.map(video => ({ type: 'video' as ContentType, data: video }));
  const smallContent = [
    ...gridBeforeAfter.map(item => ({ type: 'before-after' as ContentType, data: item })),
    ...gridQuotes.map(quote => ({ type: 'quote' as ContentType, data: quote }))
  ];
  
  // Shuffle small content
  const shuffledSmallContent = shuffleArray(smallContent);
  
  // Map to grid items based on content restrictions
  let videoIndex = 0;
  let smallIndex = 0;
  
  const gridItems: GridItem[] = GRID_LAYOUT.map((layout, index) => {
    let content;
    
    if (layout.contentType === 'video-only') {
      content = videoContent[videoIndex++];
    } else {
      content = shuffledSmallContent[smallIndex++];
    }
    
    return {
      id: `item-${index}-${content.data.id}`,
      type: content.type,
      rowSpan: layout.rowSpan,
      data: content.data
    };
  });
  
  return gridItems;
};

// Get cycling groups for quotes (groups of 2-3)
export const getQuoteCyclingGroups = (gridItems: GridItem[]): number[][] => {
  const quoteIndices = gridItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'quote')
    .map(({ index }) => index);
  
  const groups: number[][] = [];
  let currentGroup: number[] = [];
  
  quoteIndices.forEach((index, i) => {
    currentGroup.push(index);
    
    // Create groups of 2-3 items
    const groupSize = Math.random() > 0.5 ? 2 : 3;
    if (currentGroup.length >= groupSize || i === quoteIndices.length - 1) {
      groups.push([...currentGroup]);
      currentGroup = [];
    }
  });
  
  return groups;
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