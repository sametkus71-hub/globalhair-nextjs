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

// Number of slots reserved for featured items (positions 1-8)
const FEATURED_SLOT_COUNT = 8;

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
// Featured items are prioritized to appear in the first FEATURED_SLOT_COUNT positions
export const generateFullGrid = (data: ReviewsData): GridItem[] => {
  const seed = getDailySeed();
  
  // Separate featured from regular items in each category
  const featuredVideos = data.videos.filter(r => r.is_featured);
  const regularVideos = data.videos.filter(r => !r.is_featured);
  const featuredStatic = data.staticImages.filter(r => r.is_featured);
  const regularStatic = data.staticImages.filter(r => !r.is_featured);
  const featuredBeforeAfter = data.beforeAfters.filter(r => r.is_featured);
  const regularBeforeAfter = data.beforeAfters.filter(r => !r.is_featured);
  
  // Combine and shuffle all featured items (for daily variety within featured zone)
  const allFeatured = [...featuredVideos, ...featuredStatic, ...featuredBeforeAfter];
  const shuffledFeatured = shuffleWithSeed(allFeatured, seed);
  
  // Shuffle regular items
  const shuffledRegularVideos = shuffleWithSeed(regularVideos, seed);
  const shuffledRegularStatic = shuffleWithSeed(regularStatic, seed + 1);
  const shuffledRegularBeforeAfter = shuffleWithSeed(regularBeforeAfter, seed + 2);
  
  // Total items to place
  const totalItems = data.videos.length + data.staticImages.length + data.beforeAfters.length;
  
  if (totalItems === 0) return [];
  
  // Generate dynamic slot pattern for all items
  const totalVideoCount = data.videos.length;
  const slotPattern = generateSlotPattern(totalItems, totalVideoCount);
  
  // Track used items to prevent any duplicates
  const usedIds = new Set<string>();
  const gridItems: GridItem[] = [];
  
  // Featured items that need placement
  const featuredQueue = [...shuffledFeatured];
  
  // Regular content queues
  const regularVideoQueue = [...shuffledRegularVideos];
  const regularStaticQueue = [...shuffledRegularStatic];
  const regularBeforeAfterQueue = [...shuffledRegularBeforeAfter];
  
  // Small slot pool for regular items (mix before/after and static)
  const regularSmallPool = shuffleWithSeed([...regularBeforeAfterQueue, ...regularStaticQueue], seed + 3);
  let regularSmallPoolIndex = 0;
  let regularVideoIndex = 0;
  
  for (let slotIndex = 0; slotIndex < slotPattern.length; slotIndex++) {
    const slot = slotPattern[slotIndex];
    let review: Review | undefined;
    let type: ContentType;
    
    // For the first FEATURED_SLOT_COUNT slots, prioritize featured items
    const inFeaturedZone = slotIndex < FEATURED_SLOT_COUNT;
    
    if (inFeaturedZone && featuredQueue.length > 0) {
      // Place featured item
      review = featuredQueue.shift();
    } else if (slot.slotType === 'big') {
      // Big slots: prioritize videos, then static fallback
      if (regularVideoIndex < regularVideoQueue.length) {
        review = regularVideoQueue[regularVideoIndex];
        regularVideoIndex++;
      } else {
        // Find next unused static image for big slot
        for (const item of regularStaticQueue) {
          if (!usedIds.has(item.id)) {
            review = item;
            break;
          }
        }
      }
    } else {
      // Small slots: use from mixed pool, skip already used items
      while (regularSmallPoolIndex < regularSmallPool.length) {
        const candidate = regularSmallPool[regularSmallPoolIndex];
        regularSmallPoolIndex++;
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
