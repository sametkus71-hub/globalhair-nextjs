'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/review';
import { ReviewForm } from '@/components/admin/ReviewForm';

interface AdminReviewEditProps {
  id?: string;
}

export default function AdminReviewEdit({ id: propId }: AdminReviewEditProps) {
  const params = useParams();
  const router = useRouter();

  // Use propId if available, otherwise fall back to params.id
  // Also handle the case where params.id might be an array
  const idStr = propId || (Array.isArray(params?.id) ? params.id[0] : params?.id);
  const isNewReview = idStr === 'new';

  const { data: review, isLoading, isError, error } = useQuery({
    queryKey: ['review', idStr],
    queryFn: async () => {
      if (isNewReview || !idStr) return null;

      const { data, error } = await supabase
        .from('reviews' as any)
        .select('*')
        .eq('id', idStr)
        .single();

      if (error) throw error;
      return data as unknown as Review;
    },
    enabled: !!idStr && !isNewReview,
  });

  const handleSave = () => {
    router.push('/admin/reviews');
  };

  const handleCancel = () => {
    router.push('/admin/reviews');
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Er is een fout opgetreden bij het laden van de review: {(error as Error).message}
      </div>
    );
  }

  if (!isNewReview && isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb className="mb-4 md:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/reviews" className="text-muted-foreground hover:text-foreground">
                  Reviews
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground">
                {isNewReview ? 'Nieuwe Review' : 'Review Bewerken'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/reviews')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar overzicht
          </Button>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {isNewReview ? 'Nieuwe Review Toevoegen' : 'Review Bewerken'}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {isNewReview
              ? 'Vul de gegevens in om een nieuwe review toe te voegen'
              : 'Wijzig de gegevens van deze review'}
          </p>
        </div>

      </div>
      <ReviewForm
        review={review}
        onSave={handleSave}
        onClose={handleCancel}
      />
    </div>
  );
}
