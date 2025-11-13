import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/review';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, ExternalLink, Search } from 'lucide-react';

export default function AdminReviews() {
  const navigate = useNavigate();
  const [deleteReview, setDeleteReview] = useState<Review | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

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

  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    
    let filtered = reviews;
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(review => review.review_type === typeFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review.name.toLowerCase().includes(query) ||
        review.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [reviews, searchQuery, typeFilter]);

  const handleAddNew = () => {
    navigate('/admin/reviews/new');
  };

  const handleEdit = (review: Review) => {
    navigate(`/admin/reviews/${review.id}`);
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('https://globalhair.institute/nl/haartransplantatie/reviews', '_blank')}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Bekijk Frontend
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-sm gap-2"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Review
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Zoek op naam of beschrijving..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-sm">
            <SelectValue placeholder="Alle types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle types</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="before_after">Voor & Na</SelectItem>
            <SelectItem value="static_image">Foto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        {filteredReviews.length} van {reviews?.length || 0} reviews
      </p>

      {isLoading ? (
        <div className="bg-background rounded-sm p-12 text-center border border-border">
          <p className="text-muted-foreground">Laden...</p>
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="bg-background rounded-sm p-12 text-center border border-border">
          <p className="text-muted-foreground mb-4">Geen reviews gevonden</p>
          <Button 
            onClick={handleAddNew}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-sm gap-2"
          >
            <Plus className="w-4 h-4" />
            Eerste Review Toevoegen
          </Button>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-background rounded-sm p-12 text-center border border-border">
          <p className="text-muted-foreground mb-4">Geen reviews gevonden met deze filters</p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
            className="rounded-sm"
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="bg-background rounded-sm border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="py-3">Type</TableHead>
                <TableHead className="py-3">Naam</TableHead>
                <TableHead className="py-3">Behandeling</TableHead>
                <TableHead className="text-center py-3">Zichtbaar</TableHead>
                <TableHead className="text-center py-3">Uitgelicht</TableHead>
                <TableHead className="text-right py-3">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className="border-b border-border">
                  <TableCell className="py-3">
                    <Badge variant="outline" className="rounded-sm">
                      {getTypeBadge(review.review_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium py-3">{review.name}</TableCell>
                  <TableCell className="py-3">{review.behandeling}</TableCell>
                  <TableCell className="text-center py-3">
                    <Switch
                      checked={review.is_visible}
                      onCheckedChange={() => handleToggleVisible(review)}
                    />
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <Switch
                      checked={review.is_featured}
                      onCheckedChange={() => handleToggleFeatured(review)}
                    />
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(review)}
                        className="rounded-sm"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteReview(review)}
                        className="rounded-sm"
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
