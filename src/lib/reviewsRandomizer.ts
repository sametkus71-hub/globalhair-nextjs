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

  // Layout slot counts
  const videoSlots = GRID_LAYOUT.filter(l => l.contentType === 'video-only').length; // 3
  const smallSlots = GRID_LAYOUT.length - videoSlots; // 15

  // Content distribution
  const maxQuotes = Math.min(4, shuffledQuotes.length, smallSlots); // cap at 4
  const minQuotes = Math.min(2, maxQuotes); // 0-2 when not enough
  const numQuotes = maxQuotes === 0 ? 0 : Math.max(minQuotes, Math.min(maxQuotes, 2 + Math.floor(Math.random() * (maxQuotes - 2 + 1))));

  // Select content
  const selectedQuotes = shuffledQuotes.slice(0, numQuotes);
  const remainingSmall = Math.max(0, smallSlots - selectedQuotes.length);
  const selectedBeforeAfter = shuffledBeforeAfter.slice(0, remainingSmall);

  // Build small content pool and fill to required length (repeat if needed)
  const smallPool: { type: ContentType; data: any }[] = [
    ...selectedBeforeAfter.map(item => ({ type: 'before-after' as ContentType, data: item })),
    ...selectedQuotes.map(quote => ({ type: 'quote' as ContentType, data: quote }))
  ];

  const smallFilled: { type: ContentType; data: any }[] = smallPool.length >= smallSlots
    ? shuffleArray(smallPool).slice(0, smallSlots)
    : Array.from({ length: smallSlots }, (_, i) => smallPool[i % Math.max(1, smallPool.length)]);

  // Build video content and fill video slots (repeat if needed, fallback to small content if no videos)
  const selectedVideos = shuffledVideos.slice(0, Math.max(1, Math.min(videoSlots, shuffledVideos.length || 1)));
  const videoFilled: { type: ContentType; data: any }[] = shuffledVideos.length > 0
    ? Array.from({ length: videoSlots }, (_, i) => ({ type: 'video' as ContentType, data: selectedVideos[i % selectedVideos.length] }))
    : Array.from({ length: videoSlots }, (_, i) => smallFilled[i % smallFilled.length]);

  // Map to grid items based on content restrictions
  let videoIndex = 0;
  let smallIndex = 0;

  const gridItems: GridItem[] = GRID_LAYOUT.map((layout, index) => {
    const content = layout.contentType === 'video-only' ? videoFilled[videoIndex++] : smallFilled[smallIndex++];
    return {
      id: `item-${index}-${content?.data?.id ?? index}`,
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