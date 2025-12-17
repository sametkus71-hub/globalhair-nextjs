'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/review';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { ReviewThumbnail } from '@/components/admin/ReviewThumbnail';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function AdminReviews() {
  const router = useRouter();
  const [deleteReview, setDeleteReview] = useState<Review | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('created_desc');

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['admin-reviews', sortBy],
    queryFn: async () => {
      let query = supabase.from('reviews' as any).select('*');

      // Apply sorting based on sortBy state
      switch (sortBy) {
        case 'created_desc':
          query = query.order('created_at', { ascending: false });
          break;
        case 'created_asc':
          query = query.order('created_at', { ascending: true });
          break;
        case 'updated_desc':
          query = query.order('updated_at', { ascending: false });
          break;
        case 'updated_asc':
          query = query.order('updated_at', { ascending: true });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
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

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'video': return 'Video';
      case 'before_after': return 'Before/After foto\'s';
      case 'static_image': return 'Enkele foto';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    
    const reviewDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const time = format(date, 'HH:mm');
    
    if (reviewDate.getTime() === today.getTime()) {
      return `Vandaag om ${time}`;
    } else if (reviewDate.getTime() === yesterday.getTime()) {
      return `Gisteren om ${time}`;
    } else if (reviewDate.getTime() === dayBeforeYesterday.getTime()) {
      return `Eergisteren om ${time}`;
    } else {
      return format(date, 'd MMM yyyy HH:mm', { locale: nl });
    }
  };

  const handleAddNew = () => {
    router.push('/admin/reviews/new');
  };

  const handleEdit = (review: Review) => {
    router.push(`/admin/reviews/${review.id}`);
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
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
            <BreadcrumbPage className="text-foreground">Reviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Reviews Beheer
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-2">
            Bekijk en beheer alle reviews
          </p>
          <a 
            href="https://globalhair.institute/nl/haartransplantatie/reviews" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-900 hover:text-blue-700 underline"
          >
            → Bekijk frontend reviews pagina
          </a>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-blue-900 hover:bg-blue-800 text-white rounded-[1px] gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Review
        </Button>
      </div>
      <div className="mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Zoek op naam of beschrijving..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-[1px]"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] rounded-[1px]">
              <SelectValue placeholder="Sorteer op..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Nieuwste eerst</SelectItem>
              <SelectItem value="created_asc">Oudste eerst</SelectItem>
              <SelectItem value="updated_desc">Recent bijgewerkt</SelectItem>
              <SelectItem value="updated_asc">Langst bijgewerkt</SelectItem>
              <SelectItem value="name_asc">Naam (A-Z)</SelectItem>
              <SelectItem value="name_desc">Naam (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="h-4 w-px bg-border" />
          
          <RadioGroup value={typeFilter} onValueChange={setTypeFilter} className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" className="border-blue-900 text-blue-900" />
            <Label htmlFor="all" className="cursor-pointer text-sm">Alle types</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" className="border-blue-900 text-blue-900" />
            <Label htmlFor="video" className="cursor-pointer text-sm">Video</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="before_after" id="before_after" className="border-blue-900 text-blue-900" />
            <Label htmlFor="before_after" className="cursor-pointer text-sm">Before/After foto's</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="static_image" id="static_image" className="border-blue-900 text-blue-900" />
            <Label htmlFor="static_image" className="cursor-pointer text-sm">Enkele foto</Label>
          </div>
        </RadioGroup>
        </div>
      </div>
      {(searchQuery || typeFilter !== 'all') && (
        <div className="flex flex-wrap gap-2 mb-3">
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-[1px]"
            >
              Zoek: "{searchQuery}"
              <X className="w-3 h-3" />
            </button>
          )}
          {typeFilter !== 'all' && (
            <button 
              onClick={() => setTypeFilter('all')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-[1px]"
            >
              Type: {getTypeBadge(typeFilter)}
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
      <p className="text-sm text-muted-foreground mb-3">
        {filteredReviews.length} van {reviews?.length || 0} reviews
      </p>
      {isLoading ? (
        <div className="bg-background rounded-[1px] p-12 text-center border border-border">
          <p className="text-muted-foreground">Laden...</p>
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="bg-background rounded-[1px] p-12 text-center border border-border">
          <p className="text-muted-foreground mb-4">Geen reviews gevonden</p>
          <Button 
            onClick={handleAddNew}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-[1px] gap-2"
          >
            <Plus className="w-4 h-4" />
            Eerste Review Toevoegen
          </Button>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-background rounded-[1px] p-12 text-center border border-border">
          <p className="text-muted-foreground mb-4">Geen reviews gevonden met deze filters</p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
            className="rounded-[1px]"
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="bg-background rounded-[1px] border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="py-4 w-[100px]">Type</TableHead>
                <TableHead className="py-4 w-[80px]">Thumbnail</TableHead>
                <TableHead className="py-4">Naam</TableHead>
                <TableHead className="py-4">Behandeling</TableHead>
                <TableHead className="text-center py-4 w-[100px]">Zichtbaar</TableHead>
                <TableHead className="text-center py-4 w-[100px]">Uitgelicht</TableHead>
                <TableHead className="py-4 w-[160px] text-muted-foreground">Aangemaakt</TableHead>
                <TableHead className="text-right py-4 w-[120px]">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <TableCell className="py-4">
                    <Badge variant="outline" className="rounded-[1px]">
                      {getTypeBadge(review.review_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <ReviewThumbnail 
                      review={review} 
                      onClick={() => handleEdit(review)}
                    />
                  </TableCell>
                  <TableCell className="font-medium py-4">{review.name}</TableCell>
                  <TableCell className="py-4 text-muted-foreground">{review.behandeling}</TableCell>
                  <TableCell className="text-center py-4">
                    <Switch
                      checked={review.is_visible}
                      onCheckedChange={() => handleToggleVisible(review)}
                      className="data-[state=checked]:bg-blue-900"
                    />
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Switch
                      checked={review.is_featured}
                      onCheckedChange={() => handleToggleFeatured(review)}
                      className="data-[state=checked]:bg-blue-900"
                    />
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(review.created_at)}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(review)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteReview(review)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
