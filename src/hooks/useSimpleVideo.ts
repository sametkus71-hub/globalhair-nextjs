import { useState, useEffect, useCallback } from 'react';

interface VideoState {
  video: HTMLVideoElement | null;
  loading: boolean;
  error: string | null;
  ready: boolean;
}

export const useSimpleVideo = (profile: any) => {
  const [videoState, setVideoState] = useState<VideoState>({
    video: null,
    loading: false,
    error: null,
    ready: false
  });

  // Video URL mapping
  const VIDEO_MAPPING: { [key: string]: string } = {
    'man-blond-krul': 'https://vz-104aba77-1e1.b-cdn.net/5fa33fc8-7e8d-4f37-a253-dc0b4cd0f69e/playlist.m3u8',
    'man-rood-kroes': 'https://vz-104aba77-1e1.b-cdn.net/4c9e38e9-efb3-4b53-a267-85554d52f015/playlist.m3u8',
    'man-zwart-kroes': 'https://vz-104aba77-1e1.b-cdn.net/ae8e6512-fc65-4672-9988-1ecdfacd8861/playlist.m3u8',
    'man-blond-kroes': 'https://vz-104aba77-1e1.b-cdn.net/b86b3917-ecfe-45a0-8222-ef562d2fb9bc/playlist.m3u8',
    'man-bruin-kroes': 'https://vz-104aba77-1e1.b-cdn.net/02c61fc1-d278-4e9d-bc2d-76bdaef4fb50/playlist.m3u8',
    'man-blond-fijn': 'https://vz-104aba77-1e1.b-cdn.net/9b2664bb-7c67-411e-99d4-b4d298b818c9/playlist.m3u8',
    'man-bruin-fijn': 'https://vz-104aba77-1e1.b-cdn.net/8eef8635-9b77-4cc0-b179-5a47fa78622b/playlist.m3u8',
    'man-rood-fijn': 'https://vz-104aba77-1e1.b-cdn.net/813fd306-87ea-4e7e-b87e-79a981df5773/playlist.m3u8',
    'man-zwart-fijn': 'https://vz-104aba77-1e1.b-cdn.net/c8b1aad2-1f9b-484b-8980-3fca4160e87e/playlist.m3u8',
    'man-bruin-stijl': 'https://vz-104aba77-1e1.b-cdn.net/d829df6a-c9ce-41a6-9821-de296a376cde/playlist.m3u8',
    'man-rood-stijl': 'https://vz-104aba77-1e1.b-cdn.net/264753f1-30e2-450e-b171-4d0675c9245c/playlist.m3u8',
    'man-zwart-stijl': 'https://vz-104aba77-1e1.b-cdn.net/587c883d-f472-49e2-a836-d64f13c97b01/playlist.m3u8',
    'man-blond-stijl': 'https://vz-104aba77-1e1.b-cdn.net/62b595a1-ec85-471b-b320-07d28fc5ef68/playlist.m3u8',
    'man-bruin-krul': 'https://vz-104aba77-1e1.b-cdn.net/21f4fecc-474d-4fcb-b492-40276efce27d/playlist.m3u8',
    'man-zwart-krul': 'https://vz-104aba77-1e1.b-cdn.net/dbe87704-2c19-48cb-a0c9-9dd530d9ae4e/playlist.m3u8',
    'man-rood-krul': 'https://vz-104aba77-1e1.b-cdn.net/313353ce-fee9-4323-a872-6ee47ee458b0/playlist.m3u8',
  };

  // Generate video key from profile
  const getVideoKey = useCallback(() => {
    if (profile.geslacht.toLowerCase() !== 'man') {
      return null;
    }

    const hairColorMap: { [key: string]: string } = {
      'Blond': 'blond',
      'Bruin': 'bruin', 
      'Zwart': 'zwart',
      'Grijs': 'grijs',
      'Rood': 'rood'
    };
    
    const hairTypeMap: { [key: string]: string } = {
      'Fijn': 'fijn',
      'Stijl': 'stijl',
      'Krul': 'krul',
      'Kroes': 'kroes'
    };
    
    const colorKey = hairColorMap[profile.haarkleur];
    const typeKey = hairTypeMap[profile.haartype];
    
    if (!colorKey || !typeKey) {
      return null;
    }
    
    return `man-${colorKey}-${typeKey}`;
  }, [profile]);

  // Create and load video
  const createVideo = useCallback(() => {
    const videoKey = getVideoKey();
    console.log('Creating video for profile:', profile, 'videoKey:', videoKey);
    
    if (!videoKey || !VIDEO_MAPPING[videoKey]) {
      console.log('No video available for this profile');
      setVideoState({ video: null, loading: false, error: 'No video available', ready: false });
      return;
    }

    setVideoState(prev => ({ ...prev, loading: true, error: null }));

    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    
    const videoUrl = VIDEO_MAPPING[videoKey];
    console.log('Loading video URL:', videoUrl);
    
    video.addEventListener('loadeddata', () => {
      console.log('Video loaded and ready to play');
      setVideoState({
        video,
        loading: false,
        error: null,
        ready: true
      });
    });

    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      setVideoState({
        video: null,
        loading: false,
        error: 'Failed to load video',
        ready: false
      });
    });

    video.src = videoUrl;
    video.load();
  }, [getVideoKey, profile]);

  // Create video when profile changes
  useEffect(() => {
    createVideo();
    
    return () => {
      if (videoState.video) {
        videoState.video.pause();
        videoState.video.src = '';
      }
    };
  }, [createVideo]);

  const playVideo = useCallback(() => {
    if (videoState.video && videoState.ready) {
      console.log('Attempting to play video');
      return videoState.video.play().then(() => {
        console.log('Video playing successfully');
        return true;
      }).catch((error) => {
        console.error('Video play failed:', error);
        return false;
      });
    }
    return Promise.resolve(false);
  }, [videoState.video, videoState.ready]);

  return {
    ...videoState,
    playVideo,
    hasVideo: !!getVideoKey() && !!VIDEO_MAPPING[getVideoKey() || '']
  };
};