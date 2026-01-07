'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Share2, ImageIcon, Link as LinkIcon, Globe, Settings, FileText, ChevronDown, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { SeoPreview } from './SeoPreview';

// --- SCHEMA & TYPES ---

const pageSchema = z.object({
    page_title: z.string().optional(), // We allow empty, will fallback to slug or default
    slug: z.string().min(1, 'Slug is required'),
    parent_id: z.string().optional().nullable(),

    // Content
    // We'll store simple content as a JSON object with a 'body' key for now
    content: z.any().optional(),

    // Route Mapping
    component_key: z.string().optional(),

    // SEO
    seo_title: z.string().optional().nullable(),
    meta_description: z.string().optional().nullable(),

    // Social
    og_title: z.string().optional().nullable(),
    og_description: z.string().optional().nullable(),
    og_image: z.string().optional().nullable(),

    language: z.enum(['nl', 'en', 'tr', 'de', 'fr']).default('nl'),
    category: z.string().optional(),
    status: z.enum(['published', 'draft', 'archived']).default('draft'),
    is_in_sitemap: z.boolean().default(true),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PageEditorProps {
    pageId: string;
}

const generateComponentKey = () => `page_${Math.random().toString(36).substr(2, 9)}`;

export const PageEditor = ({ pageId }: PageEditorProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageData, setPageData] = useState<any>(null);
    const [potentialParents, setPotentialParents] = useState<any[]>([]);
    const [isEditingSlug, setIsEditingSlug] = useState(false);

    const form = useForm<PageFormValues>({
        resolver: zodResolver(pageSchema),
        defaultValues: {
            page_title: '',
            slug: '',
            parent_id: null,
            content: { body: '', source: 'codebase' },
            component_key: pageId === 'new' ? generateComponentKey() : '',
            seo_title: '',
            meta_description: '',
            og_title: '',
            og_description: '',
            og_image: '',
            language: 'nl',
            category: 'Other',
            status: 'draft',
            is_in_sitemap: true,
        },
    });

    // --- EFFECTS ---

    useEffect(() => {
        loadInitialData();
    }, [pageId]);

    // Re-fetch potential parents when language changes to keep it relevant
    const watchedLanguage = form.watch('language');
    useEffect(() => {
        if (!loading) {
            fetchPotentialParents(watchedLanguage);
        }
    }, [watchedLanguage, loading]);

    // --- DATA LOADING ---

    const loadInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                pageId !== 'new' ? fetchPage() : Promise.resolve(),
                fetchPotentialParents(form.getValues('language')) // Initial load
            ]);
        } catch (error) {
            console.error('Initial load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPotentialParents = async (lang: string) => {
        try {
            let query = supabase
                .from('pages')
                .select('id, page_title, slug, language')
                .eq('language', lang);

            // If editing, exclude self
            if (pageId !== 'new') {
                query = query.neq('id', pageId);
            }

            const { data, error } = await query;
            if (error) throw error;
            setPotentialParents(data || []);
        } catch (error) {
            console.error('Error fetching parents:', error);
        }
    };

    const fetchPage = async () => {
        try {
            const { data, error } = await supabase
                .from('pages')
                .select('*')
                .eq('id', pageId)
                .single();

            if (error) throw error;

            setPageData(data);
            const typedData = data as any;
            form.reset({
                page_title: typedData.page_title || '',
                slug: data.slug,
                parent_id: data.parent_id || "null",
                content: data.content || { body: '' },
                component_key: typedData.component_key || '', // Load key from typed object
                seo_title: data.seo_title || '',
                meta_description: data.meta_description || '',
                og_title: data.og_title || '',
                og_description: data.og_description || '',
                og_image: data.og_image || '',
                language: data.language as any,
                category: data.category,
                status: data.status as any,
                is_in_sitemap: data.is_in_sitemap,
            });

            if (data.language !== 'nl') {
                fetchPotentialParents(data.language);
            }

        } catch (error) {
            console.error('Error fetching page:', error);
            toast.error('Could not load page details');
            router.push('/admin/pages' as any);
        }
    };

    // --- SUBMIT ---

    const onSubmit = async (values: PageFormValues) => {
        setSaving(true);
        try {
            // Logic: If Title is empty, use Slug or fallback
            let finalTitle = values.page_title;
            if (!finalTitle || finalTitle.trim() === '') {
                finalTitle = values.slug
                    ? values.slug.split('/').pop()?.replace(/-/g, ' ')
                    : 'Untitled Page';
                // Capitalize first letter logic slightly
                if (finalTitle) finalTitle = finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1);
            }

            // Clean up Parent ID
            const cleanValues = {
                ...values,
                page_title: finalTitle,
                parent_id: values.parent_id === "null" || values.parent_id === "" ? null : values.parent_id,
                updated_at: new Date().toISOString(),
                // Ensure content is object
                content: typeof values.content === 'string' ? { body: values.content } : values.content
            };

            let error;
            if (pageId === 'new') {
                const { error: insertError } = await supabase
                    .from('pages')
                    .insert([cleanValues as any]);
                error = insertError;
            } else {
                const { error: updateError } = await supabase
                    .from('pages')
                    .update(cleanValues as any)
                    .eq('id', pageId);
                error = updateError;
            }

            if (error) throw error;

            toast.success('Page saved successfully');

            // Update local form state for title if it was empty
            form.setValue('page_title', finalTitle);

            if (pageId === 'new') {
                router.push('/admin/pages' as any);
            } else {
                fetchPage(); // Refresh data
            }
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error('Failed to save page');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Loading editor...
            </div>
        );
    }

    const currentSlug = form.watch('slug');
    const fullUrl = `https://globalhair.institute/${currentSlug}`;

    return (
        <div className="max-w-[1600px] mx-auto pb-20 pt-2 px-6">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 h-full">

                    {/* --- MAIN COLUMN (Content) --- */}
                    <div className="flex-1 space-y-8 min-w-0">
                        {/* Header Area */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/pages' as any)} className="text-gray-400 hover:text-gray-900 -ml-2 h-8 w-8 p-0 rounded-full">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {pageData ? `Editing: ${pageData.slug}` : 'New Page'}
                                </span>
                            </div>

                            {/* Title (Big) */}
                            <FormField
                                control={form.control}
                                name="page_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Page Title"
                                                {...field}
                                                className="text-4xl md:text-5xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-gray-200 h-auto py-2 bg-transparent tracking-tight leading-tight rounded-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Permalink (LOCKED) */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                                <div className="flex items-center gap-2 group cursor-not-allowed opacity-75">
                                    <span className="text-gray-400 select-none">https://globalhair.institute/</span>
                                    <span className="font-mono text-gray-700 decoration-dotted underline decoration-gray-300" title="Managed in Codebase">
                                        {currentSlug || '...'}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 ml-2">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>Locked (Codebase)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Body (Simple) */}
                        <Card className="border border-gray-100 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-2 flex items-center justify-between">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" />
                                    Page Content Source
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium bg-white px-2 py-0.5 rounded border border-gray-100">Static (Codebase)</span>
                            </div>

                            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400 bg-white/50 min-h-[300px]">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <code className="text-xl font-bold text-gray-500">{'</>'}</code>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Managed in Codebase</h3>
                                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                                    The content for this page is defined in your Next.js project files.
                                    Metadata and settings above are still synced.
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    <Globe className="w-3 h-3" />
                                    <span>Rendered via {currentSlug ? `src/app/[lang]/${currentSlug}/page.tsx` : 'Next.js Router'}</span>
                                </div>
                            </div>
                        </Card>

                        {/* SEO & Social Tabs */}
                        <Tabs defaultValue="seo" className="w-full">
                            <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 mb-6 gap-6">
                                <TabsTrigger value="seo" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-0 py-2 text-sm text-gray-500 data-[state=active]:text-black font-medium transition-all">
                                    SEO Metadata
                                </TabsTrigger>
                                <TabsTrigger value="social" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-0 py-2 text-sm text-gray-500 data-[state=active]:text-black font-medium transition-all">
                                    Social Sharing
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="seo" className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 gap-6">
                                    <Card className="border-gray-200 shadow-sm">
                                        <CardContent className="p-6">
                                            <SeoPreview
                                                title={form.watch('seo_title') || form.watch('page_title')}
                                                description={form.watch('meta_description') || ''}
                                                slug={form.watch('slug')}
                                            />
                                        </CardContent>
                                    </Card>

                                    <div className="grid gap-6">
                                        <FormField
                                            control={form.control}
                                            name="seo_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SEO Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={form.watch('page_title')} {...field} value={field.value || ''} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="meta_description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Meta Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Summarize the page..." className="resize-none h-24" {...field} value={field.value || ''} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="social" className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="og_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Social Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Same as SEO Title" {...field} value={field.value || ''} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="og_image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Social Image URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormDescription>Leave empty to inherit</FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="og_description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Social Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Same as Meta Description" className="resize-none h-24" {...field} value={field.value || ''} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Bottom Spacer */}
                        <div className="h-20" />
                    </div>


                    {/* --- SIDEBAR (Settings) --- */}
                    <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">

                        {/* Status Card */}
                        <Card className="border-gray-200 shadow-sm sticky top-6">
                            <CardHeader className="py-3 px-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-500">Publication</CardTitle>
                                    <div className={`w-2 h-2 rounded-full ${form.watch('status') === 'published' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <div className="pt-2">
                                    <Button
                                        onClick={form.handleSubmit(onSubmit)}
                                        disabled={saving}
                                        className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                                    >
                                        {saving ? 'Saving...' : (pageId === 'new' ? 'Create Page' : 'Save Changes')}
                                    </Button>
                                    <p className="text-[10px] text-gray-400 text-center mt-2">
                                        Last saved: {pageData?.updated_at ? new Date(pageData.updated_at).toLocaleTimeString() : 'Never'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organization */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/50">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-500">Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-5">
                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold text-gray-600">Language</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="nl">🇳🇱 Dutch (NL)</SelectItem>
                                                    <SelectItem value="en">🇬🇧 English (EN)</SelectItem>
                                                    <SelectItem value="tr">🇹🇷 Turkish (TR)</SelectItem>
                                                    <SelectItem value="de">🇩🇪 German (DE)</SelectItem>
                                                    <SelectItem value="fr">🇫🇷 French (FR)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold text-gray-600">Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Uncategorized" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel className="pl-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Brands</SelectLabel>
                                                        <SelectItem value="Haartransplantatie">Hairtransplant</SelectItem>
                                                        <SelectItem value="V6 Hairboost">V6 Hairboost</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel className="pl-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">Pages</SelectLabel>
                                                        <SelectItem value="Algemeen">General Page</SelectItem>
                                                        <SelectItem value="SEO">SEO Page</SelectItem>
                                                        <SelectItem value="Blog">Blog Page</SelectItem>
                                                        <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="parent_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold text-gray-600">Parent Page</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || "null"}
                                                value={field.value || "null"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="(No Parent)" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="null" className="text-gray-400 font-medium">-- No Parent --</SelectItem>
                                                    {potentialParents.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            <span className="truncate max-w-[200px] block">
                                                                {p.page_title || p.slug}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Advanced */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/50">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-500">Advanced</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {/* Component Key (Developer ID) */}
                                <FormField
                                    control={form.control}
                                    name="component_key"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Page ID (Component Key)</FormLabel>
                                            <div className="flex items-center gap-2">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        readOnly
                                                        className="h-8 text-xs font-mono bg-gray-50 text-gray-500"
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-2 bg-gray-50"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(field.value || '');
                                                        toast.success('Key copied!');
                                                    }}
                                                >
                                                    <Share2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <FormDescription className="text-[10px] text-gray-400">
                                                Unique ID linking this page to the codebase.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_in_sitemap"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded border border-gray-100 p-3">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-xs font-medium text-gray-700">Sitemap</FormLabel>
                                                <FormDescription className="text-[10px] text-gray-400">Include in sitemap.xml</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="scale-75 origin-right"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="text-[10px] text-gray-400 font-mono text-right">
                                    ID: {pageId}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-center pt-4">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs">
                                Delete Page
                            </Button>
                        </div>

                    </div>
                </form>
            </Form>
        </div>
    );
};
