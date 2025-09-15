import { useState, useEffect, useCallback } from 'react';

export const useSimpleVideo = (profile: any) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Video URL mapping
  const VIDEO_MAPPING: { [key: string]: string } = {
    // Men videos
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
    // Women videos
    'vrouw-bruin-krul': 'https://vz-104aba77-1e1.b-cdn.net/528f9b3c-0eff-4bc4-b416-d8bbdb6e0bd8/playlist.m3u8',
  };

  // Generate video key from profile
  const getVideoKey = useCallback(() => {
    const geslacht = profile.geslacht?.toLowerCase();
    if (!geslacht || (geslacht !== 'man' && geslacht !== 'vrouw')) {
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
    
    return `${geslacht}-${colorKey}-${typeKey}`;
  }, [profile]);

  // Update video source when profile changes
  useEffect(() => {
    const videoKey = getVideoKey();
    console.log('Getting video for profile:', profile, 'videoKey:', videoKey);
    
    if (!videoKey || !VIDEO_MAPPING[videoKey]) {
      console.log('No video available for this profile');
      setVideoSrc(null);
      setError('No video available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const videoUrl = VIDEO_MAPPING[videoKey];
    console.log('Setting video URL:', videoUrl);
    setVideoSrc(videoUrl);
    setLoading(false);
  }, [getVideoKey, profile]);

  const hasVideo = !!getVideoKey() && !!VIDEO_MAPPING[getVideoKey() || ''];

  return {
    videoSrc,
    loading,
    error,
    hasVideo
  };
};