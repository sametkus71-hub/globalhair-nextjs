import { Metadata } from 'next';
import { BookingPage } from "@/components/BookingPage";
import { HaartransplantatieLayout } from "@/components/haartransplantatie/HaartransplantatieLayout";

export const metadata: Metadata = {
    title: 'Boek een Afspraak - Persoonlijk Haarconsult',
    description: 'Boek een vrijblijvend haarconsult bij GlobalHair Institute. Ontvang persoonlijk advies van onze haarspecialisten over haartransplantatie, V6 Hairboost® en meer. Online of op locatie.',
};

export default function Page() {
    return (
        <HaartransplantatieLayout>
            <BookingPage />
        </HaartransplantatieLayout>
    );
}
