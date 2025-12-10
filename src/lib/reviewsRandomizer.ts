import type { Tables } from '@/integrations/supabase/types';

type Review = Tables<'reviews'>;

export type ContentType = 'video' | 'static' | 'before-after';

export interface GridItem {
  id: string;
  type: ContentType;
  width: 1 | 2;
  height: 1 | 2;
  data: Review;
}

// Seeded random for consistent daily shuffling
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const shuffleWithSeed = <T>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get today's seed (changes daily for fresh layout)
const getDailySeed = (): number => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

export interface ReviewsData {
  videos: Review[];
  staticImages: Review[];
  beforeAfters: Review[];
}

// Dynamic slot pattern generator - creates big slots every 4-5 items
const generateSlotPattern = (totalItems: number, videoCount: number): Array<{ width: 1 | 2; height: 1 | 2; slotType: 'big' | 'small' }> => {
  const pattern: Array<{ width: 1 | 2; height: 1 | 2; slotType: 'big' | 'small' }> = [];
  
  // Calculate how many big slots we need (at least enough for all videos)
  const minBigSlots = videoCount;
  const bigSlotInterval = 4; // One big slot every 4 items on average
  const totalBigSlots = Math.max(minBigSlots, Math.ceil(totalItems / bigSlotInterval));
  
  let bigSlotsPlaced = 0;
  let itemsPlaced = 0;
  
  while (itemsPlaced < totalItems) {
    // Determine if this should be a big slot
    const needBigSlot = bigSlotsPlaced < totalBigSlots && 
      (itemsPlaced % bigSlotInterval === 0 || itemsPlaced === 0);
    
    if (needBigSlot) {
      // Alternate between 2x2 squares and 1x2 tall slots
      const isTall = bigSlotsPlaced % 3 === 2;
      pattern.push({
        width: isTall ? 1 : 2,
        height: 2,
        slotType: 'big'
      });
      bigSlotsPlaced++;
    } else {
      pattern.push({
        width: 1,
        height: 1,
        slotType: 'small'
      });
    }
    itemsPlaced++;
  }
  
  return pattern;
};

// Generate complete grid using ALL items exactly once (no repeats)
export const generateFullGrid = (data: ReviewsData): GridItem[] => {
  const seed = getDailySeed();
  
  // Shuffle each pool with daily seed
  const shuffledVideos = shuffleWithSeed(data.videos, seed);
  const shuffledStatic = shuffleWithSeed(data.staticImages, seed + 1);
  const shuffledBeforeAfter = shuffleWithSeed(data.beforeAfters, seed + 2);
  
  // Total items to place
  const totalItems = shuffledVideos.length + shuffledStatic.length + shuffledBeforeAfter.length;
  
  if (totalItems === 0) return [];
  
  // Generate dynamic slot pattern
  const slotPattern = generateSlotPattern(totalItems, shuffledVideos.length);
  
  // Prepare content queues
  const videoQueue = [...shuffledVideos];
  const staticQueue = [...shuffledStatic];
  const beforeAfterQueue = [...shuffledBeforeAfter];
  
  // Small slot content: mix before/after and static
  const smallSlotPool = shuffleWithSeed([...beforeAfterQueue, ...staticQueue], seed + 3);
  let smallPoolIndex = 0;
  
  // Track used items to prevent any duplicates
  const usedIds = new Set<string>();
  
  const gridItems: GridItem[] = [];
  let videoIndex = 0;
  
  for (const slot of slotPattern) {
    let review: Review | undefined;
    let type: ContentType;
    
    if (slot.slotType === 'big') {
      // Big slots: prioritize videos, then static fallback
      if (videoIndex < videoQueue.length) {
        review = videoQueue[videoIndex];
        videoIndex++;
      } else {
        // Find next unused static image for big slot
        for (const item of staticQueue) {
          if (!usedIds.has(item.id)) {
            review = item;
            break;
          }
        }
      }
    } else {
      // Small slots: use from mixed pool, skip already used items
      while (smallPoolIndex < smallSlotPool.length) {
        const candidate = smallSlotPool[smallPoolIndex];
        smallPoolIndex++;
        if (!usedIds.has(candidate.id)) {
          review = candidate;
          break;
        }
      }
    }
    
    // Skip if no review available or already used
    if (!review || usedIds.has(review.id)) continue;
    
    usedIds.add(review.id);
    
    // Determine content type from review_type
    if (review.review_type === 'video') {
      type = 'video';
    } else if (review.review_type === 'before_after') {
      type = 'before-after';
    } else {
      type = 'static';
    }
    
    gridItems.push({
      id: review.id,
      type,
      width: slot.width,
      height: slot.height,
      data: review
    });
  }
  
  return gridItems;
};

// Legacy function for backwards compatibility
export const generateRandomGrid = generateFullGrid;

// Get indices of before/after items for cycling
export const getBeforeAfterIndices = (gridItems: GridItem[]): number[] => {
  return gridItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'before-after')
    .map(({ index }) => index);
};
