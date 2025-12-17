-- Create enum for review types
CREATE TYPE review_type AS ENUM ('video', 'before_after', 'static_image');

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_type review_type NOT NULL,
  
  -- Required text fields
  name text NOT NULL,
  description text NOT NULL,
  behandeling text NOT NULL,
  
  -- Source URLs (conditional based on type)
  video_url text,
  before_image_url text,
  after_image_url text,
  static_image_url text,
  
  -- Control fields
  is_visible boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Validation trigger function
CREATE OR REPLACE FUNCTION validate_review_media()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate based on review_type
  IF NEW.review_type = 'video' THEN
    IF NEW.video_url IS NULL OR NEW.video_url = '' THEN
      RAISE EXCEPTION 'video_url is required for video reviews';
    END IF;
  ELSIF NEW.review_type = 'before_after' THEN
    IF NEW.before_image_url IS NULL OR NEW.before_image_url = '' THEN
      RAISE EXCEPTION 'before_image_url is required for before_after reviews';
    END IF;
    IF NEW.after_image_url IS NULL OR NEW.after_image_url = '' THEN
      RAISE EXCEPTION 'after_image_url is required for before_after reviews';
    END IF;
  ELSIF NEW.review_type = 'static_image' THEN
    IF NEW.static_image_url IS NULL OR NEW.static_image_url = '' THEN
      RAISE EXCEPTION 'static_image_url is required for static_image reviews';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger
CREATE TRIGGER validate_review_media_trigger
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION validate_review_media();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
CREATE TRIGGER update_reviews_updated_at_trigger
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

-- Indexes for performance
CREATE INDEX idx_reviews_visible ON public.reviews(is_visible);
CREATE INDEX idx_reviews_featured ON public.reviews(is_featured);
CREATE INDEX idx_reviews_display_order ON public.reviews(display_order);
CREATE INDEX idx_reviews_type ON public.reviews(review_type);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public users can view visible reviews"
  ON public.reviews
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can view all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));