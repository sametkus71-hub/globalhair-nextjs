import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '@/pages/HomePage';
import HaartransplantatiePage from '@/pages/HaartransplantatiePage';
import HaartransplantatieOldPage from '@/pages/HaartransplantatieOldPage';
import HaaranalysePage from '@/pages/HaaranalysePage';
import TreatmentOptionsPage from '@/pages/TreatmentOptionsPage';
import InfoPage from '@/pages/InfoPage';
import InfoMethodPage from '@/pages/InfoMethodPage';
import InfoTrajectoryPage from '@/pages/InfoTrajectoryPage';
import MissionPage from '@/pages/MissionPage';
import SupportPage from '@/pages/SupportPage';
import SupportChatPage from '@/pages/SupportChatPage';
import ChatPage from '@/pages/ChatPage';
import V6HairboostPage from '@/pages/V6HairboostPage';
import { PackageStandardPage } from '@/pages/PackageStandardPage';
import ComingSoon1Page from '@/pages/ComingSoon1Page';
import ComingSoon2Page from '@/pages/ComingSoon2Page';
import DashboardPage from '@/pages/DashboardPage';
import FormPage from '@/pages/FormPage';
import ReviewsPage from '@/pages/ReviewsPage';
import ReviewItemPage from '@/pages/ReviewItemPage';
import ContactPage from '@/pages/ContactPage';
import BookingPage from '@/pages/BookingPage';
import NotFound from '@/pages/NotFound';

export const SEORoutes = () => {
  return (
    <Routes>
      {/* Root redirect - temporarily bypassing intro page */}
      <Route path="/" element={<HaartransplantatiePage />} />
      
      {/* Dutch routes */}
      <Route path="/nl" element={<HaartransplantatiePage />} />
      <Route path="/nl/haartransplantatie" element={<HaartransplantatiePage />} />
      <Route path="/nl/haartransplantatie/traject" element={<HaartransplantatiePage />} />
      <Route path="/nl/haartransplantatie/mission" element={<HaartransplantatiePage />} />
      <Route path="/nl/haartransplantatie/contact" element={<HaartransplantatiePage />} />
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
      <Route path="/nl/contact" element={<ContactPage />} />
      
      {/* English routes */}
      <Route path="/en" element={<HaartransplantatiePage />} />
      <Route path="/en/haartransplantatie" element={<HaartransplantatiePage />} />
      <Route path="/en/haartransplantatie/traject" element={<HaartransplantatiePage />} />
      <Route path="/en/haartransplantatie/mission" element={<HaartransplantatiePage />} />
      <Route path="/en/haartransplantatie/contact" element={<HaartransplantatiePage />} />
      <Route path="/en/hair-transplant" element={<HaartransplantatiePage />} />
      <Route path="/en/hair-transplant/traject" element={<HaartransplantatiePage />} />
      <Route path="/en/hair-transplant/mission" element={<HaartransplantatiePage />} />
      <Route path="/en/hair-transplant/contact" element={<HaartransplantatiePage />} />
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
      <Route path="/en/contact" element={<ContactPage />} />
      
      {/* Legacy support - maintain old item1 route */}
      <Route path="/nl/reviews/item1" element={<ReviewItemPage />} />
      <Route path="/en/reviews/item1" element={<ReviewItemPage />} />
      
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};