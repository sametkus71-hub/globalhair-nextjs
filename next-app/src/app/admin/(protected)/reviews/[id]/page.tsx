import AdminReviewEdit from '@/components/AdminReviewEdit';

// Force dynamic since we use params
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminReviewEditPage({ params }: PageProps) {
    const { id } = await params;
    return <AdminReviewEdit id={id} />;
}
