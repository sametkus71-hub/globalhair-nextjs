import { useState, useEffect } from 'react';
import { Review, ReviewType } from '@/types/review';
import { FileUploader } from './FileUploader';
import { FileBrowser } from './FileBrowser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReviewMobilePreview } from './ReviewMobilePreview';
import { Video, Image, ImageIcon } from 'lucide-react';

interface ReviewFormProps {
  review?: Review | null;
  onSave: () => void;
  onClose: () => void;
}

export function ReviewForm({ review, onSave, onClose }: ReviewFormProps) {
  const [fileBrowserOpen, setFileBrowserOpen] = useState<string | null>(null);
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
    <>
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-12rem)] rounded-lg border border-border">
      {/* Left Panel - Form */}
      <ResizablePanel defaultSize={55} minSize={35}>
        <div className="h-full overflow-auto bg-background p-6">
          <Tabs 
            value={formData.review_type} 
            onValueChange={(value: string) => setFormData({ ...formData, review_type: value as ReviewType })}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-muted rounded-[1px]">
              <TabsTrigger 
                value="video" 
                className="flex items-center gap-2 py-3 rounded-[1px] data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </TabsTrigger>
              <TabsTrigger 
                value="before_after" 
                className="flex items-center gap-2 py-3 rounded-[1px] data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Voor & Na</span>
              </TabsTrigger>
              <TabsTrigger 
                value="static_image" 
                className="flex items-center gap-2 py-3 rounded-[1px] data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Foto</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-6">
              {/* Tab-specific URL fields */}
              <TabsContent value="video" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL *</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="rounded-[1px]"
                  />
                  <FileUploader
                    onUploadSuccess={(url) => setFormData({ ...formData, video_url: url })}
                    folder="reviews/video"
                    accept="video/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFileBrowserOpen('video')}
                    className="w-full rounded-[1px]"
                  >
                    Browse Uploaded Videos
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Plak de URL van een video (YouTube, Vimeo, of directe link)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="before_after" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="before_image_url">Voor Foto URL *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 cursor-pointer hover:bg-accent" asChild>
                              <a href="https://tinypng.com/" target="_blank" rel="noopener noreferrer">Compress</a>
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 cursor-pointer hover:bg-accent" asChild>
                              <a href="https://imageresizer.com/image-compressor" target="_blank" rel="noopener noreferrer">Alt</a>
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Comprimeer afbeeldingen voor snellere laadtijden</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="before_image_url"
                    value={formData.before_image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, before_image_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="rounded-[1px]"
                  />
                  <FileUploader
                    onUploadSuccess={(url) => setFormData({ ...formData, before_image_url: url })}
                    folder="reviews/before_after"
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFileBrowserOpen('before')}
                    className="w-full rounded-[1px]"
                  >
                    Browse Images
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="after_image_url">Na Foto URL *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 cursor-pointer hover:bg-accent" asChild>
                              <a href="https://tinypng.com/" target="_blank" rel="noopener noreferrer">Compress</a>
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 cursor-pointer hover:bg-accent" asChild>
                              <a href="https://imageresizer.com/image-compressor" target="_blank" rel="noopener noreferrer">Alt</a>
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Comprimeer afbeeldingen voor snellere laadtijden</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="after_image_url"
                    value={formData.after_image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, after_image_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="rounded-[1px]"
                  />
                  <FileUploader
                    onUploadSuccess={(url) => setFormData({ ...formData, after_image_url: url })}
                    folder="reviews/before_after"
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFileBrowserOpen('after')}
                    className="w-full rounded-[1px]"
                  >
                    Browse Images
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="static_image" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="static_image_url">Foto URL *</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 cursor-pointer hover:bg-accent" asChild>
                              <a href="https://tinypng.com/" target="_blank" rel="noopener noreferrer">Compress</a>
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 cursor-pointer hover:bg-accent" asChild>
                              <a href="https://imageresizer.com/image-compressor" target="_blank" rel="noopener noreferrer">Alt</a>
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Comprimeer afbeeldingen voor snellere laadtijden</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="static_image_url"
                    value={formData.static_image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, static_image_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="rounded-[1px]"
                  />
                  <FileUploader
                    onUploadSuccess={(url) => setFormData({ ...formData, static_image_url: url })}
                    folder="reviews/static_image"
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFileBrowserOpen('static')}
                    className="w-full rounded-[1px]"
                  >
                    Browse Images
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Plak de URL van een afbeelding
                  </p>
                </div>
              </TabsContent>

              {/* Common Fields - shown on all tabs */}
              <div className="space-y-6 border-t border-border pt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Naam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Naam van de persoon"
                    className="rounded-[1px]"
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
                    placeholder="Bijv. Haartransplantatie"
                    className="rounded-[1px]"
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
                    placeholder="Beschrijving van de review"
                    rows={4}
                    className="rounded-[1px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Weergavevolgorde</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="rounded-[1px]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is-featured">Uitgelicht</Label>
                    <p className="text-sm text-muted-foreground">
                      Toon deze review als uitgelicht
                    </p>
                  </div>
                  <Switch
                    id="is-featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                    className="data-[state=checked]:bg-blue-900"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is-visible">Zichtbaar</Label>
                    <p className="text-sm text-muted-foreground">
                      Toon deze review op de website
                    </p>
                  </div>
                  <Switch
                    id="is-visible"
                    checked={formData.is_visible}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_visible: checked })
                    }
                    className="data-[state=checked]:bg-blue-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-[1px]"
                  disabled={isSaving}
                >
                  Annuleren
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 rounded-[1px] bg-blue-900 hover:bg-blue-800"
                >
                  {isSaving ? 'Opslaan...' : 'Opslaan'}
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel - Live Preview */}
      <ResizablePanel defaultSize={45} minSize={30}>
        <div className="h-full overflow-auto">
          <ReviewMobilePreview formData={formData} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
    
    <FileBrowser
      open={fileBrowserOpen !== null}
      onOpenChange={(open) => !open && setFileBrowserOpen(null)}
      onFileSelect={(url) => {
        if (fileBrowserOpen === 'video') {
          setFormData({ ...formData, video_url: url });
        } else if (fileBrowserOpen === 'before') {
          setFormData({ ...formData, before_image_url: url });
        } else if (fileBrowserOpen === 'after') {
          setFormData({ ...formData, after_image_url: url });
        } else if (fileBrowserOpen === 'static') {
          setFormData({ ...formData, static_image_url: url });
        }
      }}
      folder="reviews"
    />
    </>
  );
}
