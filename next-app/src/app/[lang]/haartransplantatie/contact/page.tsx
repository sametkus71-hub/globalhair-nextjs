import HaartransplantatieContactPage from "@/components/HaartransplantatieContactPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Haartransplantatie | GlobalHair Institute',
    description: 'Neem direct contact op met onze haartransplantatie specialisten.',
};

export default function Page() {
    return <HaartransplantatieContactPage />;
}
