// Quote images for the reviews grid
// These images will cycle every 4 seconds in groups of 2-3
// Quotes are non-clickable

export interface QuoteImage {
  id: string;
  src: string;
  alt: string;
}

// Real patient testimonial quotes
export const QUOTES: QuoteImage[] = [
  {
    id: 'quote-bram-klein-gunnewiek',
    src: '/assets/quotes/quote-bram-klein-gunnewiek.jpg',
    alt: 'Patient testimonial from Bram Klein Gunnewiek about hair transplant decision'
  },
  {
    id: 'quote-bram-mommens',
    src: '/assets/quotes/quote-bram-mommens.jpg',
    alt: 'Patient testimonial from Bram Mommens about regret not doing it earlier'
  },
  {
    id: 'quote-daniel-sulkers',
    src: '/assets/quotes/quote-daniel-sulkers.jpg',
    alt: 'Patient testimonial from Daniel Sulkers about GlobalHair expertise'
  },
  {
    id: 'quote-ivo-teunissen',
    src: '/assets/quotes/quote-ivo-teunissen.jpg',
    alt: 'Patient testimonial from Ivo Teunissen about excellent results'
  },
  {
    id: 'quote-jay-herman-1',
    src: '/assets/quotes/quote-jay-herman-1.jpg',
    alt: 'Patient testimonial from Jay Herman about pride in decision and results'
  },
  {
    id: 'quote-jay-herman-2',
    src: '/assets/quotes/quote-jay-herman-2.jpg',
    alt: 'Patient testimonial from Jay Herman about increased happiness'
  },
  {
    id: 'quote-marijn-kuller',
    src: '/assets/quotes/quote-marijn-kuller.jpg',
    alt: 'Patient testimonial from Marijn Kuller about quality results'
  },
  {
    id: 'quote-glenn-van-den-bosch-1',
    src: '/assets/quotes/quote-glenn-van-den-bosch-1.jpg',
    alt: 'Patient testimonial from Glenn van den Bosch about service and results'
  },
  {
    id: 'quote-glenn-van-den-bosch-2',
    src: '/assets/quotes/quote-glenn-van-den-bosch-2.jpg',
    alt: 'Patient testimonial from Glenn van den Bosch about honest communication'
  },
  {
    id: 'quote-erik-jan-van-der-kooij',
    src: '/assets/quotes/quote-erik-jan-van-der-kooij.jpg',
    alt: 'Patient testimonial from Erik Jan van der Kooij about referrals'
  }
];