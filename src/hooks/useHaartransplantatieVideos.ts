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
  
  // Direct video URL mapping - easy to edit and add new videos
  const VIDEO_MAPPING: { [key: string]: string } = {
    // Male hair transplant videos
    'man-blond-krul': 'https://vz-104aba77-1e1.b-cdn.net/5fa33fc8-7e8d-4f37-a253-dc0b4cd0f69e/playlist.m3u8', // CURLY-BLONDE
    'man-rood-kroes': 'https://vz-104aba77-1e1.b-cdn.net/4c9e38e9-efb3-4b53-a267-85554d52f015/playlist.m3u8', // AFRO-RED
    'man-zwart-kroes': 'https://vz-104aba77-1e1.b-cdn.net/ae8e6512-fc65-4672-9988-1ecdfacd8861/playlist.m3u8', // AFRO-BLACK
    'man-blond-kroes': 'https://vz-104aba77-1e1.b-cdn.net/b86b3917-ecfe-45a0-8222-ef562d2fb9bc/playlist.m3u8', // AFRO-BLONDE
    'man-bruin-kroes': 'https://vz-104aba77-1e1.b-cdn.net/02c61fc1-d278-4e9d-bc2d-76bdaef4fb50/playlist.m3u8', // AFRO-BROWN
    'man-blond-fijn': 'https://vz-104aba77-1e1.b-cdn.net/9b2664bb-7c67-411e-99d4-b4d298b818c9/playlist.m3u8', // WAVY-BLONDE
    'man-bruin-fijn': 'https://vz-104aba77-1e1.b-cdn.net/8eef8635-9b77-4cc0-b179-5a47fa78622b/playlist.m3u8', // WAVY-BROWN
    'man-rood-fijn': 'https://vz-104aba77-1e1.b-cdn.net/813fd306-87ea-4e7e-b87e-79a981df5773/playlist.m3u8', // WAVY-RED
    'man-zwart-fijn': 'https://vz-104aba77-1e1.b-cdn.net/c8b1aad2-1f9b-484b-8980-3fca4160e87e/playlist.m3u8', // WAVY-BLACK
    'man-bruin-stijl': 'https://vz-104aba77-1e1.b-cdn.net/d829df6a-c9ce-41a6-9821-de296a376cde/playlist.m3u8', // STRAIGHT-BROWN
    'man-rood-stijl': 'https://vz-104aba77-1e1.b-cdn.net/264753f1-30e2-450e-b171-4d0675c9245c/playlist.m3u8', // STRAIGHT-RED
    'man-zwart-stijl': 'https://vz-104aba77-1e1.b-cdn.net/587c883d-f472-49e2-a836-d64f13c97b01/playlist.m3u8', // STRAIGHT-BLACK
    'man-blond-stijl': 'https://vz-104aba77-1e1.b-cdn.net/62b595a1-ec85-471b-b320-07d28fc5ef68/playlist.m3u8', // STRAIGHT-BLONDE
    'man-bruin-krul': 'https://vz-104aba77-1e1.b-cdn.net/21f4fecc-474d-4fcb-b492-40276efce27d/playlist.m3u8', // CURLY-BROWN
    'man-zwart-krul': 'https://vz-104aba77-1e1.b-cdn.net/dbe87704-2c19-48cb-a0c9-9dd530d9ae4e/playlist.m3u8', // CURLY-BLACK
    'man-rood-krul': 'https://vz-104aba77-1e1.b-cdn.net/313353ce-fee9-4323-a872-6ee47ee458b0/playlist.m3u8', // CURLY-RED
  };
  
  // Generate video URL from profile
  const generateVideoUrl = useCallback((geslacht: string, haarkleur: string, haartype: string) => {
    // Only male videos are available for now
    if (geslacht.toLowerCase() !== 'man') {
      return null;
    }
    
    // Map hair colors to URL format (including RED as new option)
    const hairColorMap: { [key: string]: string } = {
      'Blond': 'blond',
      'Bruin': 'bruin', 
      'Zwart': 'zwart',
      'Grijs': 'grijs',
      'Rood': 'rood' // Added RED color option
    };
    
    const hairTypeMap: { [key: string]: string } = {
      'Fijn': 'fijn',     // WAVY videos
      'Stijl': 'stijl',   // STRAIGHT videos  
      'Krul': 'krul',     // CURLY videos
      'Kroes': 'kroes'    // AFRO videos
    };
    
    const colorKey = hairColorMap[haarkleur];
    const typeKey = hairTypeMap[haartype];
    
    if (!colorKey || !typeKey) {
      return null;
    }
    
    // Generate video key
    const videoKey = `man-${colorKey}-${typeKey}`;
    
    // Get video URL from mapping
    const videoUrl = VIDEO_MAPPING[videoKey];
    
    if (!videoUrl) {
      return null;
    }
    
    return { videoKey, videoUrl };
  }, []);
  
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