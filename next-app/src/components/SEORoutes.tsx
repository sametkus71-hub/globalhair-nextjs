import { lazy, Suspense } from 'react';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LottiePageLoader } from '@/components/LottiePageLoader';

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('@/components/HomePage'));
const HaartransplantatieLayoutPage = lazy(() => import('@/components/HaartransplantatieLayoutPage'));
const TreatmentsPage = lazy(() => import('@/components/TreatmentsPage'));
const HaartransplantatieReviewsPage = lazy(() => import('@/components/HaartransplantatieReviewsPage'));
const HowItWorksPage = lazy(() => import('@/components/HowItWorksPage'));
const HaartransplantatieMissionPage = lazy(() => import('@/components/HaartransplantatieMissionPage'));
const HaartransplantatieContactPage = lazy(() => import('@/components/HaartransplantatieContactPage'));
const BerkantDuralPage = lazy(() => import('@/components/BerkantDuralPage'));
const OzlemDuralPage = lazy(() => import('@/components/OzlemDuralPage'));
const HaartransplantatieOldPage = lazy(() => import('@/components/HaartransplantatieOldPage'));
const HaaranalysePage = lazy(() => import('@/components/HaaranalysePage'));
const TreatmentOptionsPage = lazy(() => import('@/components/TreatmentOptionsPage'));
const InfoPage = lazy(() => import('@/components/InfoPage'));
const InfoMethodPage = lazy(() => import('@/components/InfoMethodPage'));
const InfoTrajectoryPage = lazy(() => import('@/components/InfoTrajectoryPage'));
const MissionPage = lazy(() => import('@/components/MissionPage'));
const SupportPage = lazy(() => import('@/components/SupportPage'));
const SupportChatPage = lazy(() => import('@/components/SupportChatPage'));
const ChatPage = lazy(() => import('@/components/ChatPage'));
const V6HairboostPage = lazy(() => import('@/components/V6HairboostPage'));
const PackageStandardPage = lazy(() => import('@/components/PackageStandardPage').then(m => ({ default: m.PackageStandardPage })));
const ComingSoon1Page = lazy(() => import('@/components/ComingSoon1Page'));
const ComingSoon2Page = lazy(() => import('@/components/ComingSoon2Page'));
const DashboardPage = lazy(() => import('@/components/DashboardPage'));
const FormPage = lazy(() => import('@/components/FormPage'));
const ReviewsPage = lazy(() => import('@/components/ReviewsPage'));
const ReviewItemPage = lazy(() => import('@/components/ReviewItemPage'));
const ContactPage = lazy(() => import('@/components/ContactPage'));
const BookingPage = lazy(() => import('@/components/BookingPage'));
const BookingSuccessPage = lazy(() => import('@/components/BookingSuccessPage').then(m => ({ default: m.BookingSuccessPage })));
const PrivacyPolicyPage = lazy(() => import('@/components/PrivacyPolicyPage'));
const AlgemeneVoorwaardenPage = lazy(() => import('@/components/AlgemeneVoorwaardenPage'));
const AdminLogin = lazy(() => import('@/components/AdminLogin'));
const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));
const AdminReviews = lazy(() => import('@/components/AdminReviews'));
const AdminReviewEdit = lazy(() => import('@/components/AdminReviewEdit'));
const NotFound = lazy(() => import('@/components/NotFound'));

// Loading fallback component using Lottie animation
const PageLoader = () => <LottiePageLoader />;

// Minimal fallback for tab content (very fast, no layout shift)
const TabContentLoader = () => (
  <div className="w-full h-full flex items-center justify-center opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
    <div className="text-sm text-white/40">Loading...</div>
  </div>
);

export const SEORoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root redirect - temporarily bypassing intro page */}
        <Route path="/" element={<HaartransplantatieLayoutPage />}>
          <Route index element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
        </Route>

        {/* Dutch routes - nested for smooth tab transitions */}
        <Route path="/nl" element={<HaartransplantatieLayoutPage />}>
          <Route index element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
        </Route>
        <Route path="/nl/haartransplantatie" element={<HaartransplantatieLayoutPage />}>
          <Route index element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieReviewsPage /></Suspense>} />
          <Route path="how" element={<Suspense fallback={<TabContentLoader />}><HowItWorksPage /></Suspense>} />
          <Route path="traject" element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
          <Route path="mission" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieMissionPage /></Suspense>} />
          <Route path="contact" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieContactPage /></Suspense>} />
          <Route path=":country/:tier" element={<PackageStandardPage />} />
        </Route>
        <Route path="/nl/berkantdural" element={<BerkantDuralPage />} />
        <Route path="/nl/ozlemdural" element={<OzlemDuralPage />} />
        <Route path="/nl/haartransplantatie-old" element={<HaartransplantatieOldPage />} />
        <Route path="/nl/haaranalyse" element={<HaaranalysePage />} />
        <Route path="/nl/behandelopties" element={<TreatmentOptionsPage />} />
        <Route path="/nl/pakket-standaard" element={<PackageStandardPage />} />
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
        <Route path="/nl/privacybeleid" element={<PrivacyPolicyPage />} />
        <Route path="/nl/algemene-voorwaarden" element={<AlgemeneVoorwaardenPage />} />

        {/* English routes - nested for smooth tab transitions */}
        <Route path="/en" element={<HaartransplantatieLayoutPage />}>
          <Route index element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
        </Route>
        <Route path="/en/haartransplantatie" element={<HaartransplantatieLayoutPage />}>
          <Route index element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
          <Route path="traject" element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
          <Route path="mission" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieMissionPage /></Suspense>} />
          <Route path="contact" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieContactPage /></Suspense>} />
        </Route>
        <Route path="/en/hair-transplant" element={<HaartransplantatieLayoutPage />}>
          <Route index element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieReviewsPage /></Suspense>} />
          <Route path="how" element={<Suspense fallback={<TabContentLoader />}><HowItWorksPage /></Suspense>} />
          <Route path="traject" element={<Suspense fallback={<TabContentLoader />}><TreatmentsPage /></Suspense>} />
          <Route path="mission" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieMissionPage /></Suspense>} />
          <Route path="contact" element={<Suspense fallback={<TabContentLoader />}><HaartransplantatieContactPage /></Suspense>} />
          <Route path=":country/:tier" element={<PackageStandardPage />} />
        </Route>
        <Route path="/en/berkantdural" element={<BerkantDuralPage />} />
        <Route path="/en/ozlemdural" element={<OzlemDuralPage />} />
        <Route path="/en/hair-transplant-old" element={<HaartransplantatieOldPage />} />
        <Route path="/en/hair-analysis" element={<HaaranalysePage />} />
        <Route path="/en/treatment-options" element={<TreatmentOptionsPage />} />
        <Route path="/en/package-standard" element={<PackageStandardPage />} />
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
        <Route path="/en/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/en/terms-conditions" element={<AlgemeneVoorwaardenPage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/reviews" element={<ProtectedAdminRoute><AdminLayout><AdminReviews /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/reviews/:id" element={<ProtectedAdminRoute><AdminLayout><AdminReviewEdit /></AdminLayout></ProtectedAdminRoute>} />

        {/* Legacy support - maintain old item1 route */}
        <Route path="/nl/reviews/item1" element={<ReviewItemPage />} />
        <Route path="/en/reviews/item1" element={<ReviewItemPage />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};