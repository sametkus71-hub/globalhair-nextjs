import { useEffect } from 'react';

/**
 * Hook that pauses all video and audio elements when the page becomes hidden
 * and optionally resumes them when the page becomes visible again.
 * This prevents unnecessary resource usage when the tab is in the background.
 */
export const usePageVisibility = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - pause all videos and audio
        const videos = document.querySelectorAll<HTMLVideoElement>('video');
        const audios = document.querySelectorAll<HTMLAudioElement>('audio');
        
        videos.forEach((video) => {
          if (!video.paused) {
            video.pause();
            // Mark video as auto-paused so we can resume it later
            video.dataset.autoPaused = 'true';
          }
        });
        
        audios.forEach((audio) => {
          if (!audio.paused) {
            audio.pause();
            audio.dataset.autoPaused = 'true';
          }
        });
      } else {
        // Page is visible - optionally resume auto-paused videos
        const videos = document.querySelectorAll<HTMLVideoElement>('video[data-auto-paused="true"]');
        const audios = document.querySelectorAll<HTMLAudioElement>('audio[data-auto-paused="true"]');
        
        videos.forEach((video) => {
          video.play().catch(() => {
            // Autoplay might be blocked, that's ok
          });
          delete video.dataset.autoPaused;
        });
        
        audios.forEach((audio) => {
          audio.play().catch(() => {});
          delete audio.dataset.autoPaused;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
