'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Review = Tables<'reviews'>;

export interface CategorizedReviews {
  videos: Review[];
  staticImages: Review[];
  beforeAfters: Review[];
}

const fetchReviews = async (): Promise<CategorizedReviews> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  const reviews = data || [];

  // Categorize by review_type
  const videos = reviews.filter(r => r.review_type === 'video');
  const staticImages = reviews.filter(r => r.review_type === 'static_image');
  const beforeAfters = reviews.filter(r => r.review_type === 'before_after');

  return { videos, staticImages, beforeAfters };
};

export const useReviewsData = () => {
  return useQuery({
    queryKey: ['reviews', 'visible'],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
