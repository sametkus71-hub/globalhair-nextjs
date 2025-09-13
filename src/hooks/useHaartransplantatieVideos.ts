import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { useIsMobile } from '@/hooks/use-mobile';
import Hls from 'hls.js';

interface VideoCache {
  [key: string]: {
    hls?: Hls;
    video?: HTMLVideoElement;
    loaded: boolean;
    loading: boolean;
  };
}

export const useHaartransplantatieVideos = () => {
  const { profile } = useSession();
  const isMobile = useIsMobile();
  const [videoCache, setVideoCache] = useState<VideoCache>({});
  const [currentVideoKey, setCurrentVideoKey] = useState<string>('');
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  
  // Base CDN URL - same as other media
  const baseVideoUrl = 'https://vz-104aba77-1e1.b-cdn.net';
  
  // Generate video URL from profile
  const generateVideoUrl = useCallback((geslacht: string, haarkleur: string, haartype: string) => {
    // Only male videos are available for now
    if (geslacht.toLowerCase() !== 'man') {
      return null;
    }
    
    // Convert to lowercase kebab-case for URL
    const hairColorMap: { [key: string]: string } = {
      'Blond': 'blond',
      'Bruin': 'bruin', 
      'Zwart': 'zwart',
      'Grijs': 'grijs'
    };
    
    const hairTypeMap: { [key: string]: string } = {
      'Fijn': 'fijn',
      'Stijl': 'stijl',
      'Krul': 'krul',
      'Kroes': 'kroes'
    };
    
    const colorKey = hairColorMap[haarkleur];
    const typeKey = hairTypeMap[haartype];
    
    if (!colorKey || !typeKey) {
      return null;
    }
    
    // Generate video key and URL
    const videoKey = `man-${colorKey}-${typeKey}`;
    // For now, use placeholder URLs - these will be replaced with actual video URLs
    const videoUrl = `${baseVideoUrl}/haartransplantatie/${videoKey}/playlist.m3u8`;
    
    return { videoKey, videoUrl };
  }, [baseVideoUrl]);
  
  // Get current video info
  const getCurrentVideoInfo = useCallback(() => {
    return generateVideoUrl(profile.geslacht, profile.haarkleur, profile.haartype);
  }, [profile.geslacht, profile.haarkleur, profile.haartype, generateVideoUrl]);
  
  // Check if video is available for current profile
  const isVideoAvailable = useCallback(() => {
    const videoInfo = getCurrentVideoInfo();
    return videoInfo !== null;
  }, [getCurrentVideoInfo]);
  
  // Load video with HLS
  const loadVideo = useCallback((videoKey: string, videoUrl: string) => {
    if (videoCache[videoKey]?.loaded || videoCache[videoKey]?.loading) {
      return;
    }
    
    setVideoCache(prev => ({
      ...prev,
      [videoKey]: { ...prev[videoKey], loading: true }
    }));
    
    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    
    videoRefs.current[videoKey] = video;
    
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: false,
        backBufferLength: 30,
        maxBufferLength: 60
      });
      
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setVideoCache(prev => ({
          ...prev,
          [videoKey]: {
            hls,
            video,
            loaded: true,
            loading: false
          }
        }));
        
        // Preload video
        video.load();
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS Error for ${videoKey}:`, data);
        setVideoCache(prev => ({
          ...prev,
          [videoKey]: {
            loaded: false,
            loading: false
          }
        }));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = videoUrl;
      video.addEventListener('loadeddata', () => {
        setVideoCache(prev => ({
          ...prev,
          [videoKey]: {
            video,
            loaded: true,
            loading: false
          }
        }));
      });
      
      video.addEventListener('error', (e) => {
        console.error(`Video Error for ${videoKey}:`, e);
        setVideoCache(prev => ({
          ...prev,
          [videoKey]: {
            loaded: false,
            loading: false
          }
        }));
      });
    }
  }, [videoCache]);
  
  // Preload strategy: current + adjacent combinations
  const preloadVideos = useCallback(() => {
    const currentInfo = getCurrentVideoInfo();
    if (!currentInfo) return;
    
    const { videoKey: currentKey, videoUrl: currentUrl } = currentInfo;
    
    // Load current video first (highest priority)
    loadVideo(currentKey, currentUrl);
    setCurrentVideoKey(currentKey);
    
    // Preload adjacent combinations (same gender, different hair properties)
    const adjacentCombinations = [
      // Same hair type, different colors
      { geslacht: 'Man', haarkleur: 'Blond', haartype: profile.haartype },
      { geslacht: 'Man', haarkleur: 'Bruin', haartype: profile.haartype },
      { geslacht: 'Man', haarkleur: 'Zwart', haartype: profile.haartype },
      { geslacht: 'Man', haarkleur: 'Grijs', haartype: profile.haartype },
      // Same hair color, different types  
      { geslacht: 'Man', haarkleur: profile.haarkleur, haartype: 'Fijn' },
      { geslacht: 'Man', haarkleur: profile.haarkleur, haartype: 'Stijl' },
      { geslacht: 'Man', haarkleur: profile.haarkleur, haartype: 'Krul' },
      { geslacht: 'Man', haarkleur: profile.haarkleur, haartype: 'Kroes' },
    ];
    
    // Limit preloading on mobile to save bandwidth
    const maxPreload = isMobile ? 3 : 6;
    
    adjacentCombinations
      .slice(0, maxPreload)
      .forEach(combo => {
        const info = generateVideoUrl(combo.geslacht, combo.haarkleur, combo.haartype);
        if (info && info.videoKey !== currentKey) {
          // Small delay to prioritize current video
          setTimeout(() => loadVideo(info.videoKey, info.videoUrl), 500);
        }
      });
  }, [getCurrentVideoInfo, loadVideo, profile.haarkleur, profile.haartype, isMobile, generateVideoUrl]);
  
  // Update current video when profile changes
  useEffect(() => {
    preloadVideos();
  }, [preloadVideos]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(videoCache).forEach(cache => {
        if (cache.hls) {
          cache.hls.destroy();
        }
      });
      Object.values(videoRefs.current).forEach(video => {
        video.pause();
        video.src = '';
        video.load();
      });
    };
  }, []);
  
  // Get video element for current profile
  const getCurrentVideo = useCallback(() => {
    const info = getCurrentVideoInfo();
    if (!info) return null;
    
    const cache = videoCache[info.videoKey];
    return cache?.loaded ? cache.video : null;
  }, [getCurrentVideoInfo, videoCache]);
  
  // Check if current video is loaded
  const isCurrentVideoLoaded = useCallback(() => {
    const info = getCurrentVideoInfo();
    if (!info) return false;
    
    return videoCache[info.videoKey]?.loaded || false;
  }, [getCurrentVideoInfo, videoCache]);
  
  return {
    isVideoAvailable,
    getCurrentVideo,
    isCurrentVideoLoaded,
    currentVideoKey,
    videoCache
  };
};