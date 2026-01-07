'use client';

import { GlobalSettingsDialog } from './GlobalSettingsDialog';
import { useState, useEffect, Fragment, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    ChevronRight,
    ChevronDown,
    Folder,
    File,
    RefreshCw,
    Filter,
    Globe,
    Layout,
    FileText,
    ExternalLink,
    Pencil,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// --- TYPES ---

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
};

type PageNode = Page & {
    children: PageNode[];
    level: number;
};

type BrandFilter = 'all' | 'general' | 'hairtransplant' | 'v6';
type LangFilter = 'nl' | 'en' | 'tr' | 'all';
type SystemTab = 'content' | 'seo';

export const PageList = () => {
    const router = useRouter();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters - Defaults based on user feedback (NL, Standard Pages)
    const [systemTab, setSystemTab] = useState<SystemTab>('content');
    const [brandFilter, setBrandFilter] = useState<BrandFilter>('all');
    const [langFilter, setLangFilter] = useState<LangFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // State
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/admin/sync-pages', { method: 'POST' });
            const result = await response.json();

            if (!result.success) throw new Error(result.error);

            toast.success(result.message);
            fetchPages();
        } catch (error: any) {
            console.error('Sync failed:', error);
            toast.error('Sync failed: ' + error.message);
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

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

    // --- LOGIC ---

    const filteredPages = useMemo(() => {
        return pages.filter(page => {
            // 1. System Tab (Content vs SEO)
            const isSeo = page.category === 'SEO';
            if (systemTab === 'seo' && !isSeo) return false;
            if (systemTab === 'content' && isSeo) return false;

            // 2. Language
            if (langFilter !== 'all' && page.language !== langFilter) return false;

            // 3. Brand (Only applies if in Content mode, though SEO technically doesn't have brands usually)
            if (systemTab === 'content') {
                if (brandFilter === 'hairtransplant' && page.category !== 'Haartransplantatie') return false;
                if (brandFilter === 'v6' && page.category !== 'V6 Hairboost') return false;
                if (brandFilter === 'general' && (page.category === 'Haartransplantatie' || page.category === 'V6 Hairboost')) return false;
            }

            // 4. Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return page.title.toLowerCase().includes(term) || page.slug.toLowerCase().includes(term);
            }

            return true;
        });
    }, [pages, systemTab, brandFilter, langFilter, searchTerm]);

    const buildTree = (flatPages: Page[]): PageNode[] => {
        const nodes: Record<string, PageNode> = {};
        const rootNodes: PageNode[] = [];

        flatPages.forEach(p => { nodes[p.id] = { ...p, children: [], level: 0 }; });

        flatPages.forEach(page => {
            const node = nodes[page.id];
            // Only link if parent exists in visible set
            if (page.parent_id && nodes[page.parent_id]) {
                const parent = nodes[page.parent_id];
                node.level = parent.level + 1;
                parent.children.push(node);
            } else {
                rootNodes.push(node);
            }
        });

        // Sort: Folders first, then alpha
        const sortNodes = (nodeList: PageNode[]) => {
            nodeList.sort((a, b) => {
                const aIsFolder = a.children.length > 0;
                const bIsFolder = b.children.length > 0;
                if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
                return a.slug.localeCompare(b.slug);
            });
            nodeList.forEach(n => sortNodes(n.children));
        };
        sortNodes(rootNodes);

        return rootNodes;
    };

    const treeData = useMemo(() => buildTree(filteredPages), [filteredPages]);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedRows(newExpanded);
    };

    // --- RENDERERS ---

    // Language Pill
    const LangPill = ({ lang, label }: { lang: LangFilter, label: string }) => (
        <button
            onClick={() => setLangFilter(lang)}
            className={`
                px-3 py-1.5 text-xs font-medium rounded-full transition-all border
                ${langFilter === lang
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
            `}
        >
            {label}
        </button>
    );

    // Brand Tab
    const BrandTab = ({ id, label, icon: Icon }: { id: BrandFilter, label: string, icon?: any }) => (
        <button
            onClick={() => setBrandFilter(id)}
            className={`
                relative px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2
                ${brandFilter === id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}
            `}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
            {brandFilter === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
            )}
        </button>
    );

    const deletePage = async (id: string) => {
        try {
            const { error } = await supabase.from('pages').delete().eq('id', id);
            if (error) throw error;
            toast.success('Page deleted successfully');
            fetchPages();
        } catch (error) {
            console.error('Error deleting page:', error);
            toast.error('Failed to delete page');
        }
    };

    // Row Logic 
    // parentChain: boolean array. parentChain[i] is true if the ancestor at level i has subsequent siblings (needing a vertical line)
    const renderRow = (node: PageNode, isLastChild: boolean, parentChain: boolean[]) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedRows.has(node.id) || searchTerm.length > 0;
        const indentSize = 24;

        return (
            <Fragment key={node.id}>
                <TableRow className="group hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors h-12">
                    {/* Name Column with Tree Visualization */}
                    <TableCell className="py-2 pl-4 w-[35%] relative">
                        <div className="flex items-center h-full relative" style={{ paddingLeft: `${node.level * indentSize}px` }}>

                            {/* Render Guide Lines for Ancestors */}
                            {parentChain.map((hasSibling, level) => (
                                hasSibling && (
                                    <div
                                        key={level}
                                        className="absolute w-[1px] bg-gray-200 h-full"
                                        style={{ left: `${level * indentSize + 11}px` }}
                                    />
                                )
                            ))}

                            {/* Render Connector for Current Node (if not root) */}
                            {node.level > 0 && (
                                <>
                                    {/* Vertical part of the connector (from top) */}
                                    <div
                                        className="absolute w-[1px] bg-gray-200"
                                        style={{
                                            left: `${(node.level - 1) * indentSize + 11}px`, // Align with parent's line position
                                            top: 0,
                                            height: '24px' // Go to center of row (height 48 / 2)
                                        }}
                                    />
                                    {/* Horizontal part of the connector */}
                                    <div
                                        className="absolute h-[1px] bg-gray-200"
                                        style={{
                                            left: `${(node.level - 1) * indentSize + 11}px`,
                                            width: '12px',
                                            top: '24px'
                                        }}
                                    />
                                    {/* If not last child, continue vertical line down */}
                                    {!isLastChild && (
                                        <div
                                            className="absolute w-[1px] bg-gray-200"
                                            style={{
                                                left: `${(node.level - 1) * indentSize + 11}px`,
                                                top: '24px',
                                                bottom: 0
                                            }}
                                        />
                                    )}
                                </>
                            )}

                            {/* Expand/Collapse Toggle */}
                            {hasChildren && !searchTerm ? (
                                <button
                                    onClick={() => toggleRow(node.id)}
                                    className="z-10 relative mr-2 p-1 text-gray-400 hover:text-gray-900 rounded-sm hover:bg-gray-200 transition-colors"
                                >
                                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                </button>
                            ) : (
                                <div className="w-6 mr-1" />
                            )}

                            <div className="z-10 flex items-center gap-3">
                                {hasChildren ? (
                                    <Folder className={`h-4 w-4 ${isExpanded ? 'text-blue-600 fill-blue-50' : 'text-gray-400'}`} />
                                ) : (
                                    <File className="h-4 w-4 text-gray-300" />
                                )}
                                <span className={`text-sm ${hasChildren ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                    {node.title}
                                </span>
                            </div>
                        </div>
                    </TableCell>

                    {/* URL Path Column (With Hover Action) */}
                    <TableCell className="py-2 w-[25%] relative group/url">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-500 truncate max-w-[200px]">
                                /{node.slug}
                            </span>
                            <a
                                href={`/${node.slug}`}
                                target="_blank"
                                className="opacity-0 group-hover/url:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-md text-gray-400 hover:text-blue-500"
                                title="Open in new tab"
                            >
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </TableCell>

                    {/* SEO Title Column */}
                    <TableCell className="py-2 w-[15%]">
                        <span className="text-xs text-gray-500 truncate block max-w-[150px]" title={node.seo_title || node.title}>
                            {node.seo_title || <span className="text-gray-300 italic">No SEO title</span>}
                        </span>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell className="py-2 w-[10%]">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'published' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            <span className="text-xs font-medium text-gray-600 capitalize">{node.status}</span>
                        </div>
                    </TableCell>

                    {/* Persistent Actions Column (Always Visible) */}
                    <TableCell className="py-2 text-right pr-4 w-[15%]">
                        <div className="flex items-center justify-end gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => router.push(`/admin/pages/${node.id}`)}
                                title="Edit Page"
                            >
                                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs font-medium">Edit</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                                onClick={() => window.open(`/${node.slug}`, '_blank')}
                                title="View Live"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        title="Delete Page"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the page
                                            <strong className="block mt-2 text-black">"{node.title}"</strong>
                                            <span className="block text-xs font-mono mt-1 text-gray-500">/{node.slug}</span>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deletePage(node.id)} className="bg-red-600 hover:bg-red-700">
                                            Delete Page
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </TableCell>
                </TableRow>

                {hasChildren && isExpanded && (
                    node.children.map((child, index) => {
                        // Pass down ancestry info:
                        // Does the current node have updates following? If not, don't draw line at current level for children.
                        const newChain = [...parentChain, !isLastChild];
                        return renderRow(child, index === node.children.length - 1, newChain);
                    })
                )}
            </Fragment>
        );
    };

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-20">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Pages</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your website structure and content.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleSync}
                            disabled={syncing || loading}
                            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 h-10 px-4"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                            Sync Pages
                        </Button>
                        <GlobalSettingsDialog />
                        <Button
                            onClick={() => router.push('/admin/pages/new')}
                            className="bg-black hover:bg-gray-800 text-white font-medium shadow-sm h-10 px-6 rounded-lg text-sm transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Page
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-6 bg-white rounded-xl border border-gray-200 shadow-sm p-1">

                    {/* TOP TABS: Content vs SEO */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
                        <Tabs value={systemTab} onValueChange={(v: string) => setSystemTab(v as SystemTab)} className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="content" className="flex gap-2">
                                    <Layout className="w-4 h-4" />
                                    Main Content
                                </TabsTrigger>
                                <TabsTrigger value="seo" className="flex gap-2">
                                    <Search className="w-4 h-4" />
                                    SEO Pages
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Language Toggles (Always Visible) */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium mr-1 uppercase">Locale</span>
                            <LangPill lang="nl" label="NL" />
                            <LangPill lang="en" label="EN" />
                            <LangPill lang="tr" label="TR" />
                            <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                            <button
                                onClick={() => setLangFilter('all')}
                                className={`text-xs ${langFilter === 'all' ? 'text-black font-medium' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                All
                            </button>
                        </div>
                    </div>

                    {/* SECOND ROW: Brand Filters + Search */}
                    <div className="flex items-center justify-between px-4 pb-4 pt-2">

                        {systemTab === 'content' ? (
                            <div className="flex items-center gap-1">
                                <BrandTab id="all" label="All Brands" />
                                <BrandTab id="hairtransplant" label="Haartransplantatie" />
                                <BrandTab id="v6" label="V6 Hairboost" />
                                <BrandTab id="general" label="General" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500 italic px-4">
                                SEO Pages are global and not bound to specific brands.
                            </div>
                        )}

                        {/* Search Input */}
                        <div className="relative w-[300px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Filter pages..."
                                className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-sm rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 border-b border-gray-200 hover:bg-transparent">
                            <TableHead className="w-[35%] h-11 pl-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Page Name</TableHead>
                            <TableHead className="w-[25%] h-11 text-xs font-semibold uppercase tracking-wider text-gray-500">URL Path</TableHead>
                            <TableHead className="w-[15%] h-11 text-xs font-semibold uppercase tracking-wider text-gray-500">SEO Title</TableHead>
                            <TableHead className="w-[10%] h-11 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</TableHead>
                            <TableHead className="w-[15%] h-11"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                        <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                                        <span className="text-sm">Loading pages...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : treeData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center bg-gray-50/30">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                                            <Filter className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-gray-900">No pages found</span>
                                            <span className="text-xs text-gray-500">
                                                {langFilter.toUpperCase()} • {brandFilter === 'all' ? 'All Brands' : brandFilter} • {systemTab === 'seo' ? 'SEO' : 'Main'}
                                            </span>
                                        </div>
                                        {(langFilter !== 'all' || brandFilter !== 'all' || searchTerm) && (
                                            <Button variant="outline" size="sm" onClick={() => {
                                                setLangFilter('all');
                                                setBrandFilter('all');
                                                setSearchTerm('');
                                            }}>
                                                Reset Filters
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            treeData.map((node, index) => renderRow(node, index === treeData.length - 1, []))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="text-xs text-gray-400 text-center">
                Showing {filteredPages.length} {systemTab === 'seo' ? 'SEO' : 'content'} pages in {langFilter.toUpperCase()}
            </div>
        </div>
    );
};
