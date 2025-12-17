'use client';

import { useState } from 'react';
import { Review } from '@/types/review';
import { Image, Video, FileImage } from 'lucide-react';

interface ReviewThumbnailProps {
  review: Review;
  onClick?: () => void;
}

export function ReviewThumbnail({ review, onClick }: ReviewThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  // Video review
  if (review.review_type === 'video' && review.video_url && !videoError) {
    return (
      <div 
        className="relative w-15 h-15 rounded border border-border overflow-hidden bg-muted cursor-pointer group"
        onClick={handleClick}
      >
        <video
          src={review.video_url}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          onError={() => setVideoError(true)}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Video className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  // Before/After review - show before image
  if (review.review_type === 'before_after' && review.before_image_url && !imageError) {
    return (
      <div 
        className="relative w-15 h-15 rounded border border-border overflow-hidden bg-muted cursor-pointer group"
        onClick={handleClick}
      >
        <img
          src={review.before_image_url}
          alt={`${review.name} before`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Image className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  // Static image review
  if (review.review_type === 'static_image' && review.static_image_url && !imageError) {
    return (
      <div 
        className="relative w-15 h-15 rounded border border-border overflow-hidden bg-muted cursor-pointer group"
        onClick={handleClick}
      >
        <img
          src={review.static_image_url}
          alt={review.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Image className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  // Fallback - no media or error loading
  return (
    <div 
      className="w-15 h-15 rounded border border-border bg-muted flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <FileImage className="w-8 h-8 text-muted-foreground" />
    </div>
  );
}
