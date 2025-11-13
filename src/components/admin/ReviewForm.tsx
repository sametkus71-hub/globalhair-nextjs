import { useState, useEffect } from 'react';
import { Review, ReviewType } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReviewFormProps {
  review?: Review | null;
  onSave: () => void;
  onClose: () => void;
}

export function ReviewForm({ review, onSave, onClose }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    review_type: 'video' as ReviewType,
    name: '',
    description: '',
    behandeling: '',
    video_url: '',
    before_image_url: '',
    after_image_url: '',
    static_image_url: '',
    is_visible: true,
    is_featured: false,
    display_order: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (review) {
      setFormData({
        review_type: review.review_type,
        name: review.name,
        description: review.description,
        behandeling: review.behandeling,
        video_url: review.video_url || '',
        before_image_url: review.before_image_url || '',
        after_image_url: review.after_image_url || '',
        static_image_url: review.static_image_url || '',
        is_visible: review.is_visible,
        is_featured: review.is_featured,
        display_order: review.display_order,
      });
    }
  }, [review]);

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.description || !formData.behandeling) {
      toast.error('Vul alle verplichte velden in');
      return;
    }

    // Check URL fields based on type
    if (formData.review_type === 'video' && !formData.video_url) {
      toast.error('Video URL is verplicht voor video reviews');
      return;
    }
    if (formData.review_type === 'before_after') {
      if (!formData.before_image_url || !formData.after_image_url) {
        toast.error('Voor en na foto URLs zijn verplicht voor voor/na reviews');
        return;
      }
    }
    if (formData.review_type === 'static_image' && !formData.static_image_url) {
      toast.error('Foto URL is verplicht voor foto reviews');
      return;
    }

    setIsSaving(true);

    // Prepare data (only include relevant URL field)
    const dataToSave: any = {
      review_type: formData.review_type,
      name: formData.name,
      description: formData.description,
      behandeling: formData.behandeling,
      is_visible: formData.is_visible,
      is_featured: formData.is_featured,
      display_order: formData.display_order,
      video_url: null,
      before_image_url: null,
      after_image_url: null,
      static_image_url: null,
    };

    // Set the appropriate URL field
    if (formData.review_type === 'video') {
      dataToSave.video_url = formData.video_url;
    } else if (formData.review_type === 'before_after') {
      dataToSave.before_image_url = formData.before_image_url;
      dataToSave.after_image_url = formData.after_image_url;
    } else if (formData.review_type === 'static_image') {
      dataToSave.static_image_url = formData.static_image_url;
    }

    try {
      if (review) {
        // Update existing review
        const { error } = await supabase
          .from('reviews' as any)
          .update(dataToSave)
          .eq('id', review.id);

        if (error) throw error;
        toast.success('Review bijgewerkt!');
      } else {
        // Insert new review
        const { error } = await supabase
          .from('reviews' as any)
          .insert(dataToSave);

        if (error) throw error;
        toast.success('Review toegevoegd!');
      }

      onSave();
      onClose();
    } catch (error: any) {
      toast.error('Fout: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Review Type *</Label>
        <RadioGroup
          value={formData.review_type}
          onValueChange={(value) =>
            setFormData({ ...formData, review_type: value as ReviewType })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video" className="font-normal cursor-pointer">
              Video
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="before_after" id="before_after" />
            <Label htmlFor="before_after" className="font-normal cursor-pointer">
              Voor & Na Foto's
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="static_image" id="static_image" />
            <Label htmlFor="static_image" className="font-normal cursor-pointer">
              Statische Foto
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Conditional URL Fields */}
      {formData.review_type === 'video' && (
        <div className="space-y-2">
          <Label htmlFor="video_url">Video URL *</Label>
          <Input
            id="video_url"
            value={formData.video_url}
            onChange={(e) =>
              setFormData({ ...formData, video_url: e.target.value })
            }
            placeholder="https://..."
          />
        </div>
      )}

      {formData.review_type === 'before_after' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="before_image_url">Voor Foto URL *</Label>
            <Input
              id="before_image_url"
              value={formData.before_image_url}
              onChange={(e) =>
                setFormData({ ...formData, before_image_url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="after_image_url">Na Foto URL *</Label>
            <Input
              id="after_image_url"
              value={formData.after_image_url}
              onChange={(e) =>
                setFormData({ ...formData, after_image_url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
        </>
      )}

      {formData.review_type === 'static_image' && (
        <div className="space-y-2">
          <Label htmlFor="static_image_url">Foto URL *</Label>
          <Input
            id="static_image_url"
            value={formData.static_image_url}
            onChange={(e) =>
              setFormData({ ...formData, static_image_url: e.target.value })
            }
            placeholder="https://..."
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Naam *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jan Jansen"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="behandeling">Behandeling *</Label>
        <Input
          id="behandeling"
          value={formData.behandeling}
          onChange={(e) =>
            setFormData({ ...formData, behandeling: e.target.value })
          }
          placeholder="Haartransplantatie"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschrijving *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Review beschrijving..."
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_featured: checked })
          }
        />
        <Label htmlFor="is_featured" className="font-normal cursor-pointer">
          Uitgelicht
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_visible: checked })
          }
        />
        <Label htmlFor="is_visible" className="font-normal cursor-pointer">
          Zichtbaar
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          Annuleren
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Opslaan...' : 'Opslaan'}
        </Button>
      </div>
    </div>
  );
}
