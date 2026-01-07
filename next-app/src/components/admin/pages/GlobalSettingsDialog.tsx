'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export function GlobalSettingsDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [settingsId, setSettingsId] = useState<string | null>(null);
    const [siteName, setSiteName] = useState('');
    const [defaultDesc, setDefaultDesc] = useState('');
    const [defaultImage, setDefaultImage] = useState('');

    useEffect(() => {
        if (open) {
            fetchSettings();
        }
    }, [open]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .maybeSingle();

            if (data) {
                setSettingsId(data.id);
                setSiteName(data.site_name);
                setDefaultDesc(data.default_meta_description);
                setDefaultImage(data.default_og_image);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            // Don't toast error here, just let it be empty state
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                site_name: siteName,
                default_meta_description: defaultDesc,
                default_og_image: defaultImage,
                updated_at: new Date().toISOString(),
            };

            let error;

            if (settingsId) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('site_settings')
                    .update(payload)
                    .eq('id', settingsId);
                error = updateError;
            } else {
                // Create new (First time setup)
                const { error: insertError } = await supabase
                    .from('site_settings')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            toast.success('Global settings updated');
            setOpen(false);
            // Refresh to get the new ID if we just inserted
            fetchSettings();
        } catch (error: any) {
            console.error('Save Error:', error);
            toast.error('Failed: ' + (error.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-10 px-4 text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Global Settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Global Site Settings</DialogTitle>
                    <DialogDescription>
                        These defaults are used when a specific page doesn't have its own content.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-8 text-center text-sm text-gray-500">Loading settings...</div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="GlobalHair Institute"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Default Meta Description</Label>
                            <Textarea
                                id="desc"
                                value={defaultDesc}
                                onChange={(e) => setDefaultDesc(e.target.value)}
                                placeholder="Describe your site..."
                                className="h-24 resize-none"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ogImage">Default Social Image (URL)</Label>
                            <Input
                                id="ogImage"
                                value={defaultImage}
                                onChange={(e) => setDefaultImage(e.target.value)}
                                placeholder="https://..."
                            />
                            <p className="text-[10px] text-gray-400">
                                This image is used as the absolute fallback for social sharing.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button onClick={handleSave} disabled={saving || loading} className="bg-black text-white hover:bg-gray-800">
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
