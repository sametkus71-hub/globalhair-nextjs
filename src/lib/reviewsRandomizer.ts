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

// Grid layout structure - Instagram-style with mixed sizes
// 6 big slots (video priority, static fallback) + 22 small slots
const GRID_LAYOUT: Array<{ width: 1 | 2; height: 1 | 2; slotType: 'big' | 'small' }> = [
  // Pattern 1: Big square + small items
  { width: 2, height: 2, slotType: 'big' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 2: Column of 3 small items
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 3: Tall slot + 2 small
  { width: 1, height: 2, slotType: 'big' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 4: Big square + small
  { width: 2, height: 2, slotType: 'big' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 5: 3 small stacked
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 6: Tall slot + small items
  { width: 1, height: 2, slotType: 'big' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 7: Big square + tall
  { width: 2, height: 2, slotType: 'big' },
  { width: 1, height: 2, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 8: Small column
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 9: Tall slot + small items
  { width: 1, height: 2, slotType: 'big' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  
  // Pattern 10: Big square + small
  { width: 2, height: 2, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' },
  { width: 1, height: 1, slotType: 'small' }
];

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

// Generate grid from database reviews
export const generateRandomGrid = (data: ReviewsData): GridItem[] => {
  const seed = getDailySeed();
  
  // Shuffle each pool
  const shuffledVideos = shuffleWithSeed(data.videos, seed);
  const shuffledStatic = shuffleWithSeed(data.staticImages, seed + 1);
  const shuffledBeforeAfter = shuffleWithSeed(data.beforeAfters, seed + 2);

  // Find all big and small slot indices
  const bigSlotIndices = GRID_LAYOUT
    .map((layout, index) => ({ layout, index }))
    .filter(({ layout }) => layout.slotType === 'big')
    .map(({ index }) => index);

  const smallSlotIndices = GRID_LAYOUT
    .map((layout, index) => ({ layout, index }))
    .filter(({ layout }) => layout.slotType === 'small')
    .map(({ index }) => index);

  // Prepare content for big slots: videos first, then static fallback
  const bigSlotContent: Review[] = [];
  let videoIndex = 0;
  let staticForBigIndex = 0;

  for (let i = 0; i < bigSlotIndices.length; i++) {
    if (videoIndex < shuffledVideos.length) {
      bigSlotContent.push(shuffledVideos[videoIndex]);
      videoIndex++;
    } else if (staticForBigIndex < shuffledStatic.length) {
      bigSlotContent.push(shuffledStatic[staticForBigIndex]);
      staticForBigIndex++;
    }
  }

  // Remaining static images for small slots
  const remainingStatic = shuffledStatic.slice(staticForBigIndex);

  // Small slot content: all before/after + remaining static, shuffled together
  const smallSlotPool = [...shuffledBeforeAfter, ...remainingStatic];
  const shuffledSmallPool = shuffleWithSeed(smallSlotPool, seed + 3);

  // Build grid items
  const gridItems: GridItem[] = [];
  let bigContentIndex = 0;
  let smallContentIndex = 0;

  GRID_LAYOUT.forEach((layout, index) => {
    let review: Review | undefined;
    let type: ContentType;

    if (layout.slotType === 'big') {
      review = bigSlotContent[bigContentIndex];
      bigContentIndex++;
    } else {
      review = shuffledSmallPool[smallContentIndex % shuffledSmallPool.length];
      smallContentIndex++;
    }

    if (!review) return;

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
      width: layout.width,
      height: layout.height,
      data: review
    });
  });

  return gridItems;
};

// Get indices of before/after items for cycling
export const getBeforeAfterIndices = (gridItems: GridItem[]): number[] => {
  return gridItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === 'before-after')
    .map(({ index }) => index);
};
