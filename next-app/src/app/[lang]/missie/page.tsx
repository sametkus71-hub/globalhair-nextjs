import MissionPage from "@/components/MissionPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Onze Missie & Visie | GlobalHair Institute',
    description: 'Ontdek waar GlobalHair Institute voor staat: Kwaliteit, innovatie en persoonlijk resultaat.',
};

export default function Page() {
    return <MissionPage />;
}
