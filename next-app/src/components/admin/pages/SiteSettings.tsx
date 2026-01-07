'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { RefreshCw, Save, Globe, Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SiteSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // Form State
    const [settingsId, setSettingsId] = useState<string | null>(null);
    const [siteName, setSiteName] = useState('');
    const [defaultDesc, setDefaultDesc] = useState('');
    const [defaultImage, setDefaultImage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .maybeSingle();

            if (data) {
                setSettingsId(data.id);
                setSiteName(data.site_name || '');
                setDefaultDesc(data.default_meta_description || '');
                setDefaultImage(data.default_og_image || '');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            toast.error('Failed to load settings');
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
                const { error: updateError } = await supabase
                    .from('site_settings')
                    .update(payload)
                    .eq('id', settingsId);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('site_settings')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            toast.success('Settings saved successfully');
            fetchSettings();
        } catch (error: any) {
            console.error('Save Error:', error);
            toast.error('Failed: ' + (error.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/admin/sync-pages', { method: 'POST' });
            const result = await response.json();

            if (!result.success) throw new Error(result.error);

            toast.success(result.message);
        } catch (error: any) {
            console.error('Sync failed:', error);
            toast.error('Sync failed: ' + error.message);
        } finally {
            setSyncing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                    <span className="text-sm">Loading settings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6 md:p-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Site Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage global configuration and system defaults.</p>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <CardTitle className="text-base font-semibold text-gray-900">General Information</CardTitle>
                        </div>
                        <CardDescription>Basic details used throughout the website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName" className="text-gray-600 font-medium text-xs uppercase">Site Name</Label>
                            <Input
                                id="siteName"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="GlobalHair Institute"
                                className="bg-white border-gray-200 focus:border-black transition-all"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc" className="text-gray-600 font-medium text-xs uppercase">Default Meta Description</Label>
                            <Textarea
                                id="desc"
                                value={defaultDesc}
                                onChange={(e) => setDefaultDesc(e.target.value)}
                                placeholder="Describe your site for search engines..."
                                className="min-h-[100px] resize-none bg-white border-gray-200 focus:border-black transition-all"
                            />
                            <p className="text-[11px] text-gray-400">Used when a page doesn't have a specific description.</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ogImage" className="text-gray-600 font-medium text-xs uppercase">Default Social Image</Label>
                            <Input
                                id="ogImage"
                                value={defaultImage}
                                onChange={(e) => setDefaultImage(e.target.value)}
                                placeholder="https://..."
                                className="bg-white border-gray-200 focus:border-black transition-all"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System / Maintenance */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-gray-500" />
                            <CardTitle className="text-base font-semibold text-gray-900">System & Maintenance</CardTitle>
                        </div>
                        <CardDescription>Tools to manage the website's technical state.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/30">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Sync Pages</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Scan project files and update the database registry.</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSync}
                                disabled={syncing}
                                className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300 h-8"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                                {syncing ? 'Syncing...' : 'Sync Now'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-end fixed bottom-6 right-8 z-50">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-10 px-6 bg-black hover:bg-gray-800 text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
