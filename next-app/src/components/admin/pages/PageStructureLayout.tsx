'use client';

import { useState, useEffect, useMemo } from 'react';
import { StructureSidebar, StructureFilter, LanguageFilter } from './StructureSidebar';
import { PageList } from './PageList';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type Page = {
    id: string;
    parent_id: string | null;
    title: string;
    seo_title: string | null;
    slug: string;
    language: string;
    status: 'published' | 'draft' | 'archived';
    category: string;
    is_in_sitemap: boolean;
    updated_at: string;
    page_title?: string | null;
    sort_order?: number;
};

export const PageStructureLayout = () => {
    const router = useRouter();

    // -- State --
    const [selectedFilter, setSelectedFilter] = useState<StructureFilter>('brand-hairtransplant');
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // -- Fetch Data --
    const fetchPages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pages')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('slug', { ascending: true });

            if (error) throw error;

            const typedPages = (data || []).map(p => ({
                ...p,
                title: p.page_title || p.seo_title || p.slug,
                status: p.status as any,
                category: p.category as string
            }));

            setPages(typedPages);
        } catch (error) {
            console.error('Error fetching pages:', error);
            toast.error('Failed to load pages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/admin/sync-pages', { method: 'POST' });
            const result = await response.json();
            if (!result.success) throw new Error(result.error);
            toast.success(result.message);
            fetchPages();
        } catch (error: any) {
            toast.error('Sync failed: ' + error.message);
        } finally {
            setSyncing(false);
        }
    };

    // -- Counts Logic --
    const counts = useMemo(() => {
        const c = {
            'brand-hairtransplant': 0,
            'brand-v6': 0,
            'category-general': 0,
            'category-seo': 0,
            'category-blog': 0,
            'category-uncategorized': 0,
            'all': 0
        };

        pages.forEach(p => {
            // Check language filter first, as counts normally reflect the current view context
            // However, usually sidebar counts are "global" for that category to show availability.
            // Let's make them global (ignoring language filter) for structure, but typically 
            // the user expects to see what's available.
            // Let's respect language filter if it's not 'all', otherwise it's confusing.
            if (selectedLanguage !== 'all' && p.language !== selectedLanguage) return;

            c.all++;

            if (p.category === 'Haartransplantatie') c['brand-hairtransplant']++;
            if (p.category === 'V6 Hairboost') c['brand-v6']++;
            if (p.category === 'SEO') c['category-seo']++;
            if (p.category === 'Blog') c['category-blog']++;
            if (p.category === 'Uncategorized') c['category-uncategorized']++;

            // General logic
            if (p.category !== 'Haartransplantatie' &&
                p.category !== 'V6 Hairboost' &&
                p.category !== 'SEO' &&
                p.category !== 'Blog' &&
                p.category !== 'Uncategorized') {
                c['category-general']++;
            }
        });
        return c;
    }, [pages, selectedLanguage]);


    // -- Filter Logic (passed to PageList or filtered here) --
    // We filter here to control exact data passing
    const filteredPages = useMemo(() => {
        return pages.filter(page => {
            // 1. Structure Filter logic
            if (selectedFilter === 'brand-hairtransplant' && page.category !== 'Haartransplantatie') return false;
            if (selectedFilter === 'brand-v6' && page.category !== 'V6 Hairboost') return false;
            if (selectedFilter === 'category-seo' && page.category !== 'SEO') return false;
            if (selectedFilter === 'category-blog' && page.category !== 'Blog') return false;
            if (selectedFilter === 'category-uncategorized' && page.category !== 'Uncategorized') return false;

            // General: exclude brand/seo/blog/uncategorized categories
            if (selectedFilter === 'category-general' && (
                page.category === 'Haartransplantatie' ||
                page.category === 'V6 Hairboost' ||
                page.category === 'SEO' ||
                page.category === 'Blog' ||
                page.category === 'Uncategorized'
            )) return false;

            // 2. Language Filter
            if (selectedLanguage !== 'all' && page.language !== selectedLanguage) return false;

            // 3. Search (Global from Sidebar)
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return page.title.toLowerCase().includes(term) || page.slug.toLowerCase().includes(term);
            }

            return true;
        });
    }, [pages, selectedFilter, selectedLanguage, searchTerm]);


    const getHeaderTitle = () => {
        switch (selectedFilter) {
            case 'all': return 'All Pages';
            case 'brand-hairtransplant': return 'Hairtransplant Pages';
            case 'brand-v6': return 'V6 Hairboost Pages';
            case 'category-general': return 'General Pages';
            case 'category-seo': return 'SEO Landing Pages';
            case 'category-blog': return 'Blog Posts';
            case 'category-uncategorized': return 'New / Uncategorized Pages';
            default: return 'Pages';
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden bg-white">
            {/* Middle Pane: Structure */}
            <StructureSidebar
                selectedFilter={selectedFilter}
                onSelect={setSelectedFilter}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalCount={filteredPages.length}
                counts={counts}
            />

            {/* Right Pane: Content List */}
            <div className="flex-1 flex flex-col overflow-hidden h-full">
                {/* Top Action Bar for Right Pane */}
                <div className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-gray-900 text-sm tracking-tight">{getHeaderTitle()}</h2>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">{filteredPages.length}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSync}
                            disabled={syncing}
                            className="h-7 text-xs text-gray-500 hover:text-gray-900"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncing ? 'animate-spin' : ''}`} />
                            Sync
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => router.push('/admin/pages/new' as any)}
                            className="h-7 text-xs bg-black text-white hover:bg-gray-800 px-3 transition-transform active:scale-95"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            New Page
                        </Button>
                    </div>
                </div>

                {/* The List Grid */}
                <div className="flex-1 overflow-hidden">
                    <PageList
                        data={filteredPages}
                        isLoading={loading}
                        onRefresh={fetchPages}
                    />
                </div>
            </div>
        </div>
    );
};
