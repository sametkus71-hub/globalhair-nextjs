import HaartransplantatieReviewsPage from "@/components/HaartransplantatieReviewsPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Haartransplantatie Reviews & Ervaringen | GlobalHair Institute',
    description: 'Bekijk echte ervaringen en reviews van klanten die een haartransplantatie bij GlobalHair Institute hebben gehad.',
};

export default function Page() {
    return <HaartransplantatieReviewsPage />;
}
