// Özlem Aslan - Operational Manager video

export interface OzlemVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  description: string;
}

export const OZLEM_VIDEO: OzlemVideoItem = {
  id: 'ozlem-1',
  title: 'Özlem Aslan - Operational Manager',
  videoUrl: 'https://GlobalHair.b-cdn.net/Berkant%20videos/Ozlemvideo.webm',
  thumbnail: 'https://GlobalHair.b-cdn.net/Berkant%20videos/Ozlemvideo.webm#t=1',
  duration: 60,
  description: 'Als Operational Manager van GlobalHair Institute zorgt Özlem Aslan ervoor dat elke cliënt een naadloze en persoonlijke ervaring krijgt. Met haar oog voor detail en passie voor klanttevredenheid, coördineert zij alle operationele processen om de hoogste standaarden te waarborgen.'
};
