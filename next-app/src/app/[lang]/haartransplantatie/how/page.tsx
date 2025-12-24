import HowItWorksPage from "@/components/HowItWorksPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Onze Werkwijze | GlobalHair Institute',
    description: 'Stap voor stap uitleg over hoe uw haartransplantatie bij ons verloopt.',
};

export default function Page() {
    return <HowItWorksPage />;
}
