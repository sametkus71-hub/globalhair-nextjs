import { useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/review';
import { ReviewDialog } from '@/components/admin/ReviewDialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function AdminReviews() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteReview, setDeleteReview] = useState<Review | null>(null);

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews' as any)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as unknown) as Review[];
    },
  });

  const handleAddNew = () => {
    setSelectedReview(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const handleToggleVisible = async (review: Review) => {
    const { error } = await supabase
      .from('reviews' as any)
      .update({ is_visible: !review.is_visible })
      .eq('id', review.id);

    if (error) {
      toast.error('Fout bij bijwerken: ' + error.message);
    } else {
      toast.success('Zichtbaarheid bijgewerkt');
      refetch();
    }
  };

  const handleToggleFeatured = async (review: Review) => {
    const { error } = await supabase
      .from('reviews' as any)
      .update({ is_featured: !review.is_featured })
      .eq('id', review.id);

    if (error) {
      toast.error('Fout bij bijwerken: ' + error.message);
    } else {
      toast.success('Uitgelicht status bijgewerkt');
      refetch();
    }
  };

  const handleDelete = async () => {
    if (!deleteReview) return;

    const { error } = await supabase
      .from('reviews' as any)
      .delete()
      .eq('id', deleteReview.id);

    if (error) {
      toast.error('Fout bij verwijderen: ' + error.message);
    } else {
      toast.success('Review verwijderd');
      refetch();
    }
    setDeleteReview(null);
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      video: 'Video',
      before_after: 'Voor & Na',
      static_image: 'Foto',
    };
    return variants[type] || type;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <Breadcrumb className="mb-4 md:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">Reviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Reviews Beheer
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Bekijk en beheer alle reviews
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Review
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-background rounded-lg p-12 text-center border border-border">
          <p className="text-muted-foreground">Laden...</p>
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="bg-background rounded-lg p-12 text-center border border-border">
          <p className="text-muted-foreground mb-4">Geen reviews gevonden</p>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Eerste Review Toevoegen
          </Button>
        </div>
      ) : (
        <div className="bg-background rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead>Behandeling</TableHead>
                <TableHead className="text-center">Zichtbaar</TableHead>
                <TableHead className="text-center">Uitgelicht</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeBadge(review.review_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{review.name}</TableCell>
                  <TableCell>{review.behandeling}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={review.is_visible}
                      onCheckedChange={() => handleToggleVisible(review)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={review.is_featured}
                      onCheckedChange={() => handleToggleFeatured(review)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(review)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteReview(review)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        review={selectedReview}
        onSave={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />

      <AlertDialog
        open={!!deleteReview}
        onOpenChange={(open) => !open && setDeleteReview(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Wil je de review van <strong>{deleteReview?.name}</strong> echt
              verwijderen? Deze actie kan niet ongedaan gemaakt worden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
