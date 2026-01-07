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
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Share2, ImageIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { SeoPreview } from './SeoPreview';

// --- SCHEMA & TYPES ---

const pageSchema = z.object({
    page_title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    parent_id: z.string().optional().nullable(),

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
                .eq('language', lang); // Only same language parents

            // If editing, exclude self to prevent cycles
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
            form.reset({
                page_title: data.page_title || '',
                slug: data.slug,
                parent_id: data.parent_id || "null", // String for Select compatibility (handling nulls is tricky)
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

            // Update parents if language differs from default
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
            // Clean up Parent ID (convert "null" string back to real null)
            const cleanValues = {
                ...values,
                parent_id: values.parent_id === "null" || values.parent_id === "" ? null : values.parent_id,
                updated_at: new Date().toISOString(),
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
            if (pageId === 'new') {
                router.push('/admin/pages' as any);
            } else {
                fetchPage(); // Refresh
            }
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error('Failed to save page');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading editor...</div>;
    }

    const currentSlug = form.watch('slug');
    const fullUrl = `https://globalhair.institute/${currentSlug}`;

    return (
        <div className="max-w-[1200px] mx-auto pb-20">
            {/* Top Navigation */}
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" onClick={() => router.push('/admin/pages' as any)} className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Pages
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-3 space-y-4">

                        {/* Title Input */}
                        <div className="space-y-1">
                            <FormField
                                control={form.control}
                                name="page_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter title here"
                                                {...field}
                                                className="text-4xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-gray-300 h-auto py-2 bg-transparent tracking-tight leading-tight rounded-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Permalink */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 pl-1 font-mono">
                                <span className="text-gray-400">Permalink:</span>
                                {isEditingSlug ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-400">https://globalhair.institute/</span>
                                        <FormField
                                            control={form.control}
                                            name="slug"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <Input {...field} className="h-5 text-xs min-w-[200px] px-1 py-0 rounded-sm border-gray-300" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Button size="sm" variant="outline" className="h-5 px-2 text-[10px] rounded-sm uppercase tracking-wider" onClick={() => setIsEditingSlug(false)} type="button">OK</Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 group">
                                        <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 hover:underline">
                                            {fullUrl}
                                        </a>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-5 px-1 text-[10px] text-gray-300 group-hover:text-gray-500 rounded-sm uppercase tracking-wide"
                                            onClick={() => setIsEditingSlug(true)}
                                            type="button"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEO CARD */}
                        <Card className="rounded-sm shadow-none border border-gray-200">
                            <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/50">
                                <CardTitle className="text-xs font-bold text-gray-600 uppercase tracking-widest">Search Engine Optimization</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-5">
                                <SeoPreview
                                    title={form.watch('seo_title') || form.watch('page_title')}
                                    description={form.watch('meta_description') || ''}
                                    slug={form.watch('slug')}
                                />
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="seo_title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SEO Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={form.watch('page_title')} {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription className="text-[10px]">Defaults to Page Title if empty.</FormDescription>
                                                    <FormMessage />
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
                                                        <Textarea
                                                            placeholder="Summarize the page..."
                                                            className="resize-none h-[100px]"
                                                            {...field}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SOCIAL MEDIA CARD */}
                        <Card className="rounded-sm shadow-none border border-gray-200">
                            <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/50 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-blue-500" />
                                    <CardTitle className="text-xs font-bold text-gray-600 uppercase tracking-widest">Social Media Sharing</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-5">
                                <div className="p-4 bg-gray-50 border rounded-lg flex gap-4 items-start">
                                    <div className="h-24 w-24 bg-gray-200 rounded-md shrink-0 overflow-hidden flex items-center justify-center border border-gray-300">
                                        {form.watch('og_image') ? (
                                            <img src={form.watch('og_image')!} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-center p-2">
                                                <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                                <span className="text-[9px] text-gray-500 leading-tight block">Inherited Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="text-xs uppercase text-gray-400 font-bold">GLOBALHAIR.INSTITUTE</div>
                                        <div className="font-bold text-gray-900 line-clamp-2">
                                            {form.watch('og_title') || form.watch('seo_title') || form.watch('page_title') || 'Page Title'}
                                        </div>
                                        <div className="text-sm text-gray-600 line-clamp-2">
                                            {form.watch('og_description') || form.watch('meta_description') || 'Page description...'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="og_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Social Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Same as SEO Title" {...field} value={field.value || ''} />
                                                </FormControl>
                                                <FormDescription className="text-[10px]">Leave empty to use SEO Title.</FormDescription>
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
                                                <FormDescription className="text-[10px]">Leave empty to inherit from Parent Page.</FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="col-span-1 md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="og_description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Social Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Same as Meta Description"
                                                            className="resize-none h-20"
                                                            {...field}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-4">
                        {/* Publish Box */}
                        <Card className="rounded-sm shadow-none border border-gray-200">
                            <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/50">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-500">Publish</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 font-medium">Status:</span>
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-7 w-[110px] rounded-sm border-gray-300 text-xs">
                                                            <SelectValue placeholder="Stats" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-sm">
                                                        <SelectItem value="published">Published</SelectItem>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-gray-100 gap-2">
                                    {pageData?.status === 'draft' && (
                                        <Button variant="ghost" size="sm" type="button" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 rounded-sm text-xs font-medium uppercase tracking-wide">Trash</Button>
                                    )}
                                    <Button
                                        onClick={form.handleSubmit(onSubmit)}
                                        disabled={saving}
                                        className={`w-full text-white rounded-sm h-8 text-xs font-bold uppercase tracking-widest ${saving ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'}`}
                                    >
                                        {saving ? 'Updating...' : (pageId === 'new' ? 'Publish' : 'Update')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Page Attributes */}
                        <Card className="rounded-sm shadow-none border border-gray-200">
                            <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/50">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-gray-500">Attributes</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">

                                <FormField
                                    control={form.control}
                                    name="parent_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parent Page</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || "null"}
                                                value={field.value || "null"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-sm border-gray-300 h-8 text-xs">
                                                        <SelectValue placeholder="(no parent)" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-sm">
                                                    <SelectItem value="null">-- No Parent --</SelectItem>
                                                    {potentialParents.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.page_title || p.slug}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-[10px]">Assigning a parent organizes this page in the tree view.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Language</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-sm border-gray-300 h-8 text-xs">
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-sm">
                                                    <SelectItem value="nl">Dutch (NL)</SelectItem>
                                                    <SelectItem value="en">English (EN)</SelectItem>
                                                    <SelectItem value="tr">Turkish (TR)</SelectItem>
                                                    <SelectItem value="de">German (DE)</SelectItem>
                                                    <SelectItem value="fr">French (FR)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-sm border-gray-300 h-8 text-xs">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-sm">
                                                    <SelectItem value="Algemeen">Algemeen</SelectItem>
                                                    <SelectItem value="Haartransplantatie">Haartransplantatie</SelectItem>
                                                    <SelectItem value="V6 Hairboost">V6 Hairboost</SelectItem>
                                                    <SelectItem value="SEO">SEO</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_in_sitemap"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-sm border border-gray-200 p-2 bg-gray-50/50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sitemap</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="scale-75"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </Form>
        </div>
    );
};
