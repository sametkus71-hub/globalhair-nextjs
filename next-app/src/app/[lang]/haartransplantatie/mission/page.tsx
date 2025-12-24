import HaartransplantatieMissionPage from "@/components/HaartransplantatieMissionPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Missie Haartransplantatie | GlobalHair Institute',
    description: 'Onze missie is het leveren van de hoogste kwaliteit haartransplantaties.',
};

export default function Page() {
    return <HaartransplantatieMissionPage />;
}
