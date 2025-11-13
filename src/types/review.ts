export type ReviewType = 'video' | 'before_after' | 'static_image';

export interface Review {
  id: string;
  review_type: ReviewType;
  name: string;
  description: string;
  behandeling: string;
  video_url?: string | null;
  before_image_url?: string | null;
  after_image_url?: string | null;
  static_image_url?: string | null;
  is_visible: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
