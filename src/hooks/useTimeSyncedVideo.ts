import { useRef, useCallback, useState } from 'react';
import Hls from 'hls.js';

interface TimeSyncedVideoConfig {
  onTimeUpdate?: (time: number) => void;
  onVideoReady?: () => void;
  onError?: (error: any) => void;
}

export const useTimeSyncedVideo = (config: TimeSyncedVideoConfig = {}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const transitionTimeRef = useRef<number>(0);

  // Enhanced HLS configuration for better buffering and performance
  const createHlsInstance = useCallback(() => {
    if (!Hls.isSupported()) return null;
    
    return new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      startLevel: -1,
      maxBufferLength: 30,
      maxBufferSize: 60 * 1000 * 1000,
      maxBufferHole: 0.5,
      backBufferLength: 10,
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 3,
      manifestLoadingRetryDelay: 500,
      levelLoadingTimeOut: 10000,
      fragLoadingTimeOut: 20000,
      // Optimize for smooth playback
      nudgeOffset: 0.1,
      nudgeMaxRetry: 3,
      maxMaxBufferLength: 600,
      startFragPrefetch: true,
    });
  }, []);

  // Load video with enhanced buffering and time tracking
  const loadVideoWithTimeSync = useCallback((
    video: HTMLVideoElement | null,
    hlsRef: React.MutableRefObject<Hls | null>,
    src: string,
    targetTime: number = 0
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!video) {
        reject(new Error('Video element not available'));
        return;
      }

      // Clean up existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const onVideoReady = () => {
        video.removeEventListener('loadeddata', onVideoReady);
        video.removeEventListener('error', onVideoError);
        
        // Seek to target time if specified
        if (targetTime > 0) {
          video.currentTime = targetTime;
          
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            config.onVideoReady?.();
            resolve();
          };
          
          video.addEventListener('seeked', onSeeked, { once: true });
        } else {
          config.onVideoReady?.();
          resolve();
        }
      };

      const onVideoError = (error: any) => {
        video.removeEventListener('loadeddata', onVideoReady);
        video.removeEventListener('error', onVideoError);
        config.onError?.(error);
        reject(error);
      };

      if (src.includes('.m3u8')) {
        if (Hls.isSupported()) {
          hlsRef.current = createHlsInstance();
          if (!hlsRef.current) {
            reject(new Error('HLS not supported'));
            return;
          }

          hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
            video.addEventListener('loadeddata', onVideoReady, { once: true });
            video.addEventListener('error', onVideoError, { once: true });
          });

          hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error('Fatal HLS error:', data);
              onVideoError(data);
            } else {
              // Non-fatal errors - attempt recovery
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hlsRef.current?.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hlsRef.current?.recoverMediaError();
                  break;
              }
            }
          });

          hlsRef.current.loadSource(src);
          hlsRef.current.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = src;
          video.addEventListener('loadeddata', onVideoReady, { once: true });
          video.addEventListener('error', onVideoError, { once: true });
          video.load();
        }
      } else {
        // Regular video file
        video.src = src;
        video.addEventListener('loadeddata', onVideoReady, { once: true });
        video.addEventListener('error', onVideoError, { once: true });
        video.load();
      }
    });
  }, [createHlsInstance, config]);

  // Track current video time
  const trackVideoTime = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;

    const onTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      config.onTimeUpdate?.(time);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [config]);

  // Synchronized crossfade with time matching
  const startTimeSyncedCrossfade = useCallback(async (
    currentVideo: HTMLVideoElement | null,
    nextVideo: HTMLVideoElement | null,
    nextHlsRef: React.MutableRefObject<Hls | null>,
    nextSrc: string,
    onComplete: () => void
  ) => {
    if (!currentVideo || !nextVideo || isTransitioning) return;

    setIsTransitioning(true);
    
    try {
      // Capture current time
      const currentPlaybackTime = currentVideo.currentTime;
      transitionTimeRef.current = currentPlaybackTime;
      
      console.log('🎬 Starting time-synced crossfade at time:', currentPlaybackTime);

      // Load and sync next video
      await loadVideoWithTimeSync(nextVideo, nextHlsRef, nextSrc, currentPlaybackTime);
      
      // Ensure both videos are playing at the same time
      const syncPromises = [
        nextVideo.play().catch(console.warn),
        new Promise<void>(resolve => {
          if (Math.abs(nextVideo.currentTime - currentPlaybackTime) < 0.1) {
            resolve();
          } else {
            const onSynced = () => {
              if (Math.abs(nextVideo.currentTime - currentPlaybackTime) < 0.1) {
                nextVideo.removeEventListener('timeupdate', onSynced);
                resolve();
              }
            };
            nextVideo.addEventListener('timeupdate', onSynced);
          }
        })
      ];

      await Promise.all(syncPromises);
      
      console.log('✨ Videos synchronized, starting visual crossfade');
      
      // Start visual crossfade
      onComplete();
      
    } catch (error) {
      console.error('❌ Time-synced crossfade failed:', error);
      // Fallback to regular crossfade
      onComplete();
    } finally {
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800); // Allow extra time for CSS transitions
    }
  }, [isTransitioning, loadVideoWithTimeSync]);

  // Get current playback time
  const getCurrentTime = useCallback(() => currentTime, [currentTime]);
  
  // Get transition time (time when last transition started)
  const getTransitionTime = useCallback(() => transitionTimeRef.current, []);

  return {
    loadVideoWithTimeSync,
    trackVideoTime,
    startTimeSyncedCrossfade,
    getCurrentTime,
    getTransitionTime,
    isTransitioning,
    createHlsInstance
  };
};