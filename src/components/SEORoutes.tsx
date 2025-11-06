import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const TreatmentsPage = lazy(() => import('@/pages/TreatmentsPage'));
const HaartransplantatieReviewsPage = lazy(() => import('@/pages/HaartransplantatieReviewsPage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const HaartransplantatieMissionPage = lazy(() => import('@/pages/HaartransplantatieMissionPage'));
const HaartransplantatieContactPage = lazy(() => import('@/pages/HaartransplantatieContactPage'));
const HaartransplantatieOldPage = lazy(() => import('@/pages/HaartransplantatieOldPage'));
const HaaranalysePage = lazy(() => import('@/pages/HaaranalysePage'));
const TreatmentOptionsPage = lazy(() => import('@/pages/TreatmentOptionsPage'));
const InfoPage = lazy(() => import('@/pages/InfoPage'));
const InfoMethodPage = lazy(() => import('@/pages/InfoMethodPage'));
const InfoTrajectoryPage = lazy(() => import('@/pages/InfoTrajectoryPage'));
const MissionPage = lazy(() => import('@/pages/MissionPage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const SupportChatPage = lazy(() => import('@/pages/SupportChatPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const V6HairboostPage = lazy(() => import('@/pages/V6HairboostPage'));
const PackageStandardPage = lazy(() => import('@/pages/PackageStandardPage').then(m => ({ default: m.PackageStandardPage })));
const ComingSoon1Page = lazy(() => import('@/pages/ComingSoon1Page'));
const ComingSoon2Page = lazy(() => import('@/pages/ComingSoon2Page'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const FormPage = lazy(() => import('@/pages/FormPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const ReviewItemPage = lazy(() => import('@/pages/ReviewItemPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const BookingSuccessPage = lazy(() => import('@/pages/BookingSuccessPage').then(m => ({ default: m.BookingSuccessPage })));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-lg text-foreground/60">Loading...</div>
  </div>
);

export const SEORoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Root redirect - temporarily bypassing intro page */}
      <Route path="/" element={<TreatmentsPage />} />
      
      {/* Dutch routes */}
      <Route path="/nl" element={<TreatmentsPage />} />
      <Route path="/nl/haartransplantatie" element={<TreatmentsPage />} />
      <Route path="/nl/haartransplantatie/reviews" element={<HaartransplantatieReviewsPage />} />
      <Route path="/nl/haartransplantatie/how" element={<HowItWorksPage />} />
      <Route path="/nl/haartransplantatie/traject" element={<TreatmentsPage />} />
      <Route path="/nl/haartransplantatie/mission" element={<HaartransplantatieMissionPage />} />
      <Route path="/nl/haartransplantatie/contact" element={<HaartransplantatieContactPage />} />
      <Route path="/nl/haartransplantatie-old" element={<HaartransplantatieOldPage />} />
      <Route path="/nl/haaranalyse" element={<HaaranalysePage />} />
      <Route path="/nl/behandelopties" element={<TreatmentOptionsPage />} />
      <Route path="/nl/pakket-standaard" element={<PackageStandardPage />} />
      <Route path="/nl/haartransplantatie/:country/:tier" element={<PackageStandardPage />} />
      <Route path="/nl/v6-hairboost" element={<V6HairboostPage />} />
      <Route path="/nl/coming-soon-1" element={<ComingSoon1Page />} />
      <Route path="/nl/coming-soon-2" element={<ComingSoon2Page />} />
      <Route path="/nl/dashboard" element={<DashboardPage />} />
      <Route path="/nl/form" element={<FormPage />} />
      <Route path="/nl/reviews" element={<ReviewsPage />} />
      <Route path="/nl/reviews/:slug" element={<ReviewItemPage />} />
      <Route path="/nl/missie" element={<MissionPage />} />
      <Route path="/nl/info" element={<InfoPage />} />
      <Route path="/nl/info/methode" element={<InfoMethodPage />} />
      <Route path="/nl/info/traject" element={<InfoTrajectoryPage />} />
      <Route path="/nl/support" element={<SupportPage />} />
      <Route path="/nl/support/chat" element={<SupportChatPage />} />
      <Route path="/nl/chat" element={<ChatPage />} />
      <Route path="/nl/boek" element={<BookingPage />} />
      <Route path="/nl/booking-success" element={<BookingSuccessPage />} />
      <Route path="/nl/contact" element={<ContactPage />} />
      
      {/* English routes */}
      <Route path="/en" element={<TreatmentsPage />} />
      <Route path="/en/haartransplantatie" element={<TreatmentsPage />} />
      <Route path="/en/haartransplantatie/traject" element={<TreatmentsPage />} />
      <Route path="/en/haartransplantatie/mission" element={<HaartransplantatieMissionPage />} />
      <Route path="/en/haartransplantatie/contact" element={<HaartransplantatieContactPage />} />
      <Route path="/en/hair-transplant" element={<TreatmentsPage />} />
      <Route path="/en/hair-transplant/reviews" element={<HaartransplantatieReviewsPage />} />
      <Route path="/en/hair-transplant/how" element={<HowItWorksPage />} />
      <Route path="/en/hair-transplant/traject" element={<TreatmentsPage />} />
      <Route path="/en/hair-transplant/mission" element={<HaartransplantatieMissionPage />} />
      <Route path="/en/hair-transplant/contact" element={<HaartransplantatieContactPage />} />
      <Route path="/en/hair-transplant-old" element={<HaartransplantatieOldPage />} />
      <Route path="/en/hair-analysis" element={<HaaranalysePage />} />
      <Route path="/en/treatment-options" element={<TreatmentOptionsPage />} />
      <Route path="/en/package-standard" element={<PackageStandardPage />} />
      <Route path="/en/hair-transplant/:country/:tier" element={<PackageStandardPage />} />
      <Route path="/en/v6-hairboost" element={<V6HairboostPage />} />
      <Route path="/en/coming-soon-1" element={<ComingSoon1Page />} />
      <Route path="/en/coming-soon-2" element={<ComingSoon2Page />} />
      <Route path="/en/dashboard" element={<DashboardPage />} />
      <Route path="/en/form" element={<FormPage />} />
      <Route path="/en/reviews" element={<ReviewsPage />} />
      <Route path="/en/reviews/:slug" element={<ReviewItemPage />} />
      <Route path="/en/mission" element={<MissionPage />} />
      <Route path="/en/info" element={<InfoPage />} />
      <Route path="/en/info/method" element={<InfoMethodPage />} />
      <Route path="/en/info/trajectory" element={<InfoTrajectoryPage />} />
      <Route path="/en/support" element={<SupportPage />} />
      <Route path="/en/support/chat" element={<SupportChatPage />} />
      <Route path="/en/chat" element={<ChatPage />} />
      <Route path="/en/book" element={<BookingPage />} />
      <Route path="/en/booking-success" element={<BookingSuccessPage />} />
      <Route path="/en/contact" element={<ContactPage />} />
      
      {/* Legacy support - maintain old item1 route */}
      <Route path="/nl/reviews/item1" element={<ReviewItemPage />} />
      <Route path="/en/reviews/item1" element={<ReviewItemPage />} />
      
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};