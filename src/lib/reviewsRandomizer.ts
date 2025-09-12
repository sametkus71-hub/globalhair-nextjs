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

// Original grid layout structure (15 items total)
const GRID_LAYOUT: Array<{ rowSpan: 1 | 2 }> = [
  { rowSpan: 1 }, // Item 1
  { rowSpan: 1 }, // Item 2  
  { rowSpan: 1 }, // Item 3
  { rowSpan: 2 }, // Item 4 (vertical)
  { rowSpan: 1 }, // Item 5
  { rowSpan: 1 }, // Item 6
  { rowSpan: 1 }, // Item 7
  { rowSpan: 1 }, // Item 8
  { rowSpan: 2 }, // Item 9 (vertical)
  { rowSpan: 1 }, // Item 10
  { rowSpan: 1 }, // Item 11
  { rowSpan: 1 }, // Item 12
  { rowSpan: 1 }, // Item 13
  { rowSpan: 1 }, // Item 14
  { rowSpan: 2 }  // Item 15 (vertical)
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
  
  // Determine content distribution
  const totalItems = 15;
  const maxVideos = Math.min(4, shuffledVideos.length); // Max 3-4 videos
  const numVideos = Math.floor(Math.random() * (maxVideos - 2)) + 2; // 2-4 videos
  const numBeforeAfter = Math.floor(Math.random() * 4) + 3; // 3-6 before/after items
  const numQuotes = totalItems - numVideos - numBeforeAfter; // Remaining are quotes
  
  // Create content pools for this grid
  const gridVideos = shuffledVideos.slice(0, numVideos);
  const gridBeforeAfter = shuffledBeforeAfter.slice(0, numBeforeAfter);
  const gridQuotes = shuffledQuotes.slice(0, numQuotes);
  
  // Combine all content and shuffle
  const allContent: { type: ContentType; data: any }[] = [
    ...gridVideos.map(video => ({ type: 'video' as ContentType, data: video })),
    ...gridBeforeAfter.map(item => ({ type: 'before-after' as ContentType, data: item })),
    ...gridQuotes.map(quote => ({ type: 'quote' as ContentType, data: quote }))
  ];
  
  const shuffledContent = shuffleArray(allContent);
  
  // Map to grid items
  const gridItems: GridItem[] = GRID_LAYOUT.map((layout, index) => {
    const content = shuffledContent[index];
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