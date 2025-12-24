import ContactPage from "@/components/ContactPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact | GlobalHair Institute',
    description: 'Neem contact op met GlobalHair Institute voor al uw vragen over haartransplantaties en haarverbetering.',
};

export default function Page() {
    return <ContactPage />;
}
