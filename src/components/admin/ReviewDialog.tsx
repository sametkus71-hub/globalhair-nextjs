import { Review } from '@/types/review';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReviewForm } from './ReviewForm';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review | null;
  onSave: () => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  review,
  onSave,
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {review ? 'Review Bewerken' : 'Nieuwe Review Toevoegen'}
          </DialogTitle>
        </DialogHeader>
        <ReviewForm
          review={review}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
