// Before/After images for the reviews grid
// These images cycle between before/after every 4 seconds in groups of 2
// Before/after items are clickable and lead to individual review pages

export interface BeforeAfterItem {
  id: string;
  image: string; // Single before/after image from CDN
}

// Before/After images from CDN - randomized on each page load
export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    id: 'before-after-1',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_1.png'
  },
  {
    id: 'before-after-2',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_2.png'
  },
  {
    id: 'before-after-3',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_3.png'
  },
  {
    id: 'before-after-4',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_4.png'
  },
  {
    id: 'before-after-5',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_5.png'
  },
  {
    id: 'before-after-6',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_6.png'
  },
  {
    id: 'before-after-7',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_7.png'
  },
  {
    id: 'before-after-8',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_8.png'
  },
  {
    id: 'before-after-9',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_9.png'
  },
  {
    id: 'before-after-10',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_10.png'
  },
  {
    id: 'before-after-11',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_11.png'
  },
  {
    id: 'before-after-12',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_12.png'
  },
  {
    id: 'before-after-13',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_13.png'
  },
  {
    id: 'before-after-14',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_14.png'
  },
  {
    id: 'before-after-15',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_15.png'
  },
  {
    id: 'before-after-16',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_16.png'
  },
  {
    id: 'before-after-17',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_17.png'
  },
  {
    id: 'before-after-18',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_18.png'
  },
  {
    id: 'before-after-19',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_19.png'
  },
  {
    id: 'before-after-20',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_20.png'
  },
  {
    id: 'before-after-21',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_21.png'
  },
  {
    id: 'before-after-22',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_22.png'
  },
  {
    id: 'before-after-23',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_23.png'
  },
  {
    id: 'before-after-24',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_24.png'
  },
  {
    id: 'before-after-25',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_25.png'
  },
  {
    id: 'before-after-26',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_26.png'
  },
  {
    id: 'before-after-27',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_27.png'
  },
  {
    id: 'before-after-28',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_28.png'
  },
  {
    id: 'before-after-29',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_29.png'
  },
  {
    id: 'before-after-30',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_30.png'
  },
  {
    id: 'before-after-31',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_31.png'
  },
  {
    id: 'before-after-32',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_32.png'
  },
  {
    id: 'before-after-33',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_33.png'
  },
  {
    id: 'before-after-34',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/GHI_TEMPLATE_BEFOR%26AFTER_34.png'
  },
  {
    id: 'before-after-35',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/1.jpg'
  },
  {
    id: 'before-after-36',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/10.jpg'
  },
  {
    id: 'before-after-37',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/11.jpg'
  },
  {
    id: 'before-after-38',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/12.jpg'
  },
  {
    id: 'before-after-39',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/2.jpg'
  },
  {
    id: 'before-after-40',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/3.jpg'
  },
  {
    id: 'before-after-41',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/4.jpg'
  },
  {
    id: 'before-after-42',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/5.jpg'
  },
  {
    id: 'before-after-43',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/6.jpg'
  },
  {
    id: 'before-after-44',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/7.jpg'
  },
  {
    id: 'before-after-45',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/8.jpg'
  },
  {
    id: 'before-after-46',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/9.jpg'
  },
  {
    id: 'before-after-47',
    image: 'https://GlobalHair.b-cdn.net/reviews%20-%20before-after/Items%20aangeleverd%20door%20Peter/FD%20after.jpg'
  },
];