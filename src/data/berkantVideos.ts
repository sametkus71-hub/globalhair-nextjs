// Berkant founder videos - paired subbed/unsubbed versions
// Subbed videos are shown in the reviews grid (muted autoplay)
// Unsubbed videos are shown in the mission page (unmuted, full screen)

export interface BerkantVideoItem {
  id: string;
  title: string;
  videoUrl: string; // Compressed WebM video
  thumbnail: string; // Video frame thumbnail
  duration: number; // Duration in seconds
  description: string;
}

// Berkant founder videos from GlobalHair CDN - compressed WebM format
export const BERKANT_VIDEOS: BerkantVideoItem[] = [
  {
    id: 'berkant-1',
    title: 'Berkant - Founder Story 1',
    videoUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B1%20-%20COMPRESS%20(1)%20(1).webm',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B1%20-%20COMPRESS%20(1)%20(1).webm#t=1',
    duration: 45,
    description: 'CEO Berkant Dural groeide op in een familie waar kaalheid vanzelfsprekend was, en dat werd zijn drijfveer. GlobalHair ontstond uit die persoonlijke zoektocht: een kliniek gebouwd op aandacht, rust en vakmanschap. Met zijn team werkt hij elke dag aan één doel; het herstellen van zelfvertrouwen, met precisie en respect voor het ambacht.'
  },
  {
    id: 'berkant-2', 
    title: 'Berkant - Founder Story 2',
    videoUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B2%20-%20COMPRESS%20(1).webm',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B2%20-%20COMPRESS%20(1).webm#t=1',
    duration: 50,
    description: 'De reis achter de GlobalHair methodologie begon met een simpele vraag: waarom wachten tot het te laat is? Berkant ontwikkelde een holistische aanpak die preventie en behandeling combineert voor optimale resultaten.'
  },
  {
    id: 'berkant-3',
    title: 'Berkant - Founder Story 3', 
    videoUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B3%20-%20COMPRESS%20(1).webm',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B3%20-%20COMPRESS%20(1).webm#t=1',
    duration: 40,
    description: 'Innovatie in haartransplantatie technologie betekent voor GlobalHair niet alleen de nieuwste technieken toepassen, maar vooral het creëren van natuurlijke, blijvende resultaten die perfect aansluiten bij wie je bent.'
  },
  {
    id: 'berkant-4',
    title: 'Berkant - Founder Story 4',
    videoUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B4-COMPRESS-1.webm',
    thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/B4-COMPRESS-1.webm#t=1',
    duration: 55,
    description: 'De toekomst van gepersonaliseerde haarbehandelingen ligt in het begrijpen van elke individuele cliënt. Berkant en zijn team ontwikkelden een aanpak waarbij jouw unieke situatie centraal staat voor de beste langetermijn resultaten.'
  }
];

// Helper function to get unsubbed video by ID
export const getBerkantVideoById = (id: string): BerkantVideoItem | undefined => {
  return BERKANT_VIDEOS.find(video => video.id === id);
};