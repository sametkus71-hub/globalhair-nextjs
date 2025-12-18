import { ReviewsPage } from "@/components/ReviewsPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ervaringen & Reviews | GlobalHair Institute',
    description: 'Bekijk de ervaringen van onze klanten met haartransplantatie bij GlobalHair Institute.',
};

export default function Page() {
    return <ReviewsPage />;
}
