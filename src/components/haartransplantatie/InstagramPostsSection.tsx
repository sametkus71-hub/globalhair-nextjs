import { useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useInstagramScroll } from '@/hooks/useInstagramScroll';
import { useScrollZones } from '@/hooks/useScrollZones';
import { InstagramPost } from './InstagramPost';
import { PostImage } from './PostImage';

export const InstagramPostsSection = () => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { registerZone, unregisterZone, isInInstagramZone } = useScrollZones();
  
  const { currentPost, nextPost, previousPost, canGoNext, canGoPrevious, containerRef } = useInstagramScroll({
    postCount: 5,
    enabled: isInInstagramZone, // Only enable when in Instagram zone
    onPostChange: (post) => {
      console.log('Current post changed to:', post);
    }
  });

  // Register this section as a scroll zone
  useEffect(() => {
    if (sectionRef.current) {
      registerZone('instagram-posts', sectionRef.current);
      return () => unregisterZone('instagram-posts');
    }
  }, [registerZone, unregisterZone]);

  // Simple sample posts for testing
  const posts = [
    {
      id: 1,
      title: language === 'nl' ? 'Test Post 1' : 'Test Post 1',
      description: language === 'nl' ? 'Dit is een test post om de scroll functionaliteit te testen.' : 'This is a test post to test the scroll functionality.'
    },
    {
      id: 2,
      title: language === 'nl' ? 'Test Post 2' : 'Test Post 2',
      description: language === 'nl' ? 'Tweede test post met basis content.' : 'Second test post with basic content.'
    },
    {
      id: 3,
      title: language === 'nl' ? 'Test Post 3' : 'Test Post 3',
      description: language === 'nl' ? 'Derde test post voor snap scroll.' : 'Third test post for snap scroll.'
    },
    {
      id: 4,
      title: language === 'nl' ? 'Test Post 4' : 'Test Post 4',
      description: language === 'nl' ? 'Vierde test post om gedrag te controleren.' : 'Fourth test post to check behavior.'
    },
    {
      id: 5,
      title: language === 'nl' ? 'Test Post 5' : 'Test Post 5',
      description: language === 'nl' ? 'Laatste test post met eenvoudige content.' : 'Last test post with simple content.'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full"
      style={{ 
        height: `${posts.length * 100}vh`,
      }}
    >
      {/* Posts Container - Only active when in Instagram zone */}
      <div 
        ref={containerRef}
        className={`w-full transition-all duration-300 ${
          isInInstagramZone 
            ? 'fixed inset-0 z-20 overflow-hidden' 
            : 'relative'
        }`}
        style={{
          transform: isInInstagramZone ? `translateY(-${currentPost * 100}vh)` : 'none',
          height: isInInstagramZone ? '100vh' : `${posts.length * 100}vh`,
          touchAction: isInInstagramZone ? 'none' : 'auto',
          overscrollBehavior: isInInstagramZone ? 'none' : 'auto'
        }}
      >
        {posts.map((post, index) => (
          <InstagramPost 
            key={post.id} 
            postIndex={index} 
            isActive={isInInstagramZone && currentPost === index}
          >
            <div className="flex flex-col justify-center items-center h-full p-8 text-center">
              <div className="max-w-md mx-auto">
                <PostImage 
                  alt={post.title}
                  className="mb-6 h-48"
                />
                
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  {post.title}
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8">
                  {post.description}
                </p>
                
                <div className="text-sm text-muted-foreground">
                  Post {index + 1} of {posts.length}
                </div>
              </div>
            </div>
          </InstagramPost>
        ))}
      </div>

      {/* Progress Indicator - Only show when in Instagram zone */}
      {isInInstagramZone && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-2">
          {posts.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentPost 
                  ? 'bg-primary' 
                  : 'bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};