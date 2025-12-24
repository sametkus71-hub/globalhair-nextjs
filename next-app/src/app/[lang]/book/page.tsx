import { BookingPage } from "@/components/BookingPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Book an Appointment - Personal Hair Consultation',
    description: 'Book a no-obligation hair consultation at GlobalHair Institute. Get personal advice from our hair specialists about hair transplantation, V6 Hairboost® and more.',
};

export default function Page() {
    return <BookingPage />;
}
