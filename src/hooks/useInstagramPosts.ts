import { useState, useEffect, useCallback } from 'react';

export const useInstagramPosts = () => {
  const [currentPost, setCurrentPost] = useState(0);

  // Smooth scroll to specific post
  const scrollToPost = useCallback((index: number) => {
    const posts = document.querySelectorAll('.snap-section');
    const targetPost = posts[index];
    
    if (targetPost) {
      targetPost.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Track current post with Intersection Observer
  useEffect(() => {
    const posts = document.querySelectorAll('.snap-section');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Array.from(posts).indexOf(entry.target);
            if (index !== -1) {
              setCurrentPost(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px'
      }
    );

    posts.forEach((post) => observer.observe(post));

    return () => {
      posts.forEach((post) => observer.unobserve(post));
    };
  }, []);

  // Handle scroll to next post
  const scrollToNext = useCallback(() => {
    const posts = document.querySelectorAll('.snap-section');
    const nextIndex = Math.min(currentPost + 1, posts.length - 1);
    scrollToPost(nextIndex);
  }, [currentPost, scrollToPost]);

  return {
    currentPost,
    scrollToPost,
    scrollToNext
  };
};