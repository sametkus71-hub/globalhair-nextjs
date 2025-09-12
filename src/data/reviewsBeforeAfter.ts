// Before/After images for the reviews grid
// These images cycle between before/after every 4 seconds in groups of 2
// Before/after items are clickable and lead to individual review pages

export interface BeforeAfterItem {
  id: string;
  slug: string; // Used for URL routing
  patientName: string;
  treatmentType: string;
  beforeImage: string;
  afterImage: string;
  // Content for individual review page
  content: {
    title: string;
    description: string;
    treatmentDetails: {
      procedure: string;
      duration: string;
      recovery: string;
      grafts?: string;
    };
    results: string;
  };
}

// Placeholder before/after items - user will upload real images and content
export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    id: 'patient-1',
    slug: 'john-doe-fue-transplant',
    patientName: 'John D.',
    treatmentType: 'FUE Hair Transplant',
    beforeImage: '/placeholder.svg',
    afterImage: '/placeholder.svg',
    content: {
      title: 'John D. - FUE Hair Transplant Results',
      description: 'Amazing transformation after 12 months of FUE hair transplant procedure.',
      treatmentDetails: {
        procedure: 'FUE Hair Transplant',
        duration: '8 hours',
        recovery: '7-10 days',
        grafts: '3,200 grafts'
      },
      results: 'Complete natural hairline restoration with excellent density improvement.'
    }
  },
  {
    id: 'patient-2',
    slug: 'michael-smith-crown-restoration',
    patientName: 'Michael S.',
    treatmentType: 'Crown Restoration',
    beforeImage: '/placeholder.svg',
    afterImage: '/placeholder.svg',
    content: {
      title: 'Michael S. - Crown Area Restoration',
      description: 'Successful crown area restoration showing natural results after 10 months.',
      treatmentDetails: {
        procedure: 'FUE Crown Restoration',
        duration: '6 hours',
        recovery: '5-7 days',
        grafts: '2,100 grafts'
      },
      results: 'Significant density improvement in the crown area with natural growth pattern.'
    }
  },
  {
    id: 'patient-3',
    slug: 'david-johnson-hairline-reconstruction',
    patientName: 'David J.',
    treatmentType: 'Hairline Reconstruction',
    beforeImage: '/placeholder.svg',
    afterImage: '/placeholder.svg',
    content: {
      title: 'David J. - Complete Hairline Reconstruction',
      description: 'Full hairline reconstruction with natural results after 14 months.',
      treatmentDetails: {
        procedure: 'Advanced FUE Technique',
        duration: '9 hours',
        recovery: '7-14 days',
        grafts: '4,500 grafts'
      },
      results: 'Complete transformation with natural hairline and excellent coverage.'
    }
  },
  {
    id: 'patient-4',
    slug: 'robert-brown-temple-restoration',
    patientName: 'Robert B.',
    treatmentType: 'Temple Restoration',
    beforeImage: '/placeholder.svg',
    afterImage: '/placeholder.svg',
    content: {
      title: 'Robert B. - Temple Area Restoration',
      description: 'Temple area restoration showing natural growth after 11 months.',
      treatmentDetails: {
        procedure: 'Micro FUE Technique',
        duration: '5 hours',
        recovery: '5-7 days',
        grafts: '1,800 grafts'
      },
      results: 'Natural temple restoration with excellent angle and direction.'
    }
  },
  {
    id: 'patient-5',
    slug: 'james-wilson-full-restoration',
    patientName: 'James W.',
    treatmentType: 'Full Head Restoration',
    beforeImage: '/placeholder.svg',
    afterImage: '/placeholder.svg',
    content: {
      title: 'James W. - Complete Hair Restoration',
      description: 'Comprehensive hair restoration procedure with outstanding results.',
      treatmentDetails: {
        procedure: 'Advanced FUE + DHI',
        duration: '12 hours',
        recovery: '10-14 days',
        grafts: '5,200 grafts'
      },
      results: 'Complete transformation from significant hair loss to full natural coverage.'
    }
  },
  {
    id: 'patient-6',
    slug: 'thomas-garcia-vertex-treatment',
    patientName: 'Thomas G.',
    treatmentType: 'Vertex Treatment',
    beforeImage: '/placeholder.svg',
    afterImage: '/placeholder.svg',
    content: {
      title: 'Thomas G. - Vertex Area Treatment',
      description: 'Successful vertex treatment with natural density restoration.',
      treatmentDetails: {
        procedure: 'FUE Vertex Restoration',
        duration: '7 hours',
        recovery: '7-10 days',
        grafts: '2,800 grafts'
      },
      results: 'Excellent density restoration in vertex area with natural whorl pattern.'
    }
  }
];