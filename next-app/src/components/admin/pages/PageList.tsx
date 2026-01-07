'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FileText,
    Pencil,
    Eye,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
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
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageListProps } from './PageStructureLayout'; // We might need to split types if circular, but for now duplicate types here

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

interface PageListComponentProps {
    data: Page[]; // Controlled by parent
    isLoading: boolean;
    onRefresh: () => void;
}

export const PageList = ({
    data,
    isLoading,
    onRefresh
}: PageListComponentProps) => {
    const router = useRouter();

    // State
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [pageToDelete, setPageToDelete] = useState<PageNode | null>(null);

    const deletePage = async () => {
        if (!pageToDelete) return;
        try {
            const { error } = await supabase.from('pages').delete().eq('id', pageToDelete.id);
            if (error) throw error;
            toast.success('Page deleted successfully');
            onRefresh(); // Trigger parent refresh
        } catch (error) {
            console.error('Error deleting page:', error);
            toast.error('Failed to delete page');
        } finally {
            setPageToDelete(null);
        }
    };

    const treeData = useMemo(() => {
        const nodes: Record<string, PageNode> = {};
        const rootNodes: PageNode[] = [];

        // 1. Create Nodes
        data.forEach(p => { nodes[p.id] = { ...p, children: [], level: 0 }; });

        // 2. Build Tree
        data.forEach(page => {
            const node = nodes[page.id];
            // Only parent if parent is also in the current filtered set
            // This ensures if we filter by something that hides the parent, the child shows up at root (or we could hide it).
            // For now, flattening the list if parent is missing is safer than hiding it.
            if (page.parent_id && nodes[page.parent_id]) {
                const parent = nodes[page.parent_id];
                node.level = parent.level + 1;
                parent.children.push(node);
            } else {
                rootNodes.push(node);
            }
        });

        // 3. Sort: Folders first, then Title/Slug
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
    }, [data]);

    const toggleRow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedRows(newExpanded);
    };

    // --- RENDER ---

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            published: 'text-emerald-700 bg-emerald-50 border-emerald-100',
            draft: 'text-gray-600 bg-gray-50 border-gray-100',
            archived: 'text-amber-700 bg-amber-50 border-amber-100'
        };
        const style = styles[status as keyof typeof styles] || styles.draft;
        return (
            <span className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium border ${style} uppercase tracking-wide`}>
                {status}
            </span>
        );
    };

    const renderNode = (node: PageNode) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedRows.has(node.id); // Expand toggle is local state
        const paddingLeft = node.level * 20 + 8;

        return (
            <div key={node.id} className="group flex flex-col">
                <div
                    className={`
                        relative grid grid-cols-[1fr_100px_100px] gap-2 items-center h-[34px] pr-4 
                        hover:bg-blue-50/50 border-b border-gray-100 transition-colors cursor-default text-[13px]
                        ${pageToDelete?.id === node.id ? 'bg-red-50' : ''}
                    `}
                >
                    {/* Column 1: Title Tree */}
                    <div className="flex items-center min-w-0" style={{ paddingLeft: `${paddingLeft}px` }}>
                        {/* Toggle */}
                        <div
                            className={cn(
                                "w-5 h-5 flex items-center justify-center -ml-1 cursor-pointer hover:bg-black/5 rounded mr-1 transition-colors",
                                !hasChildren && "invisible"
                            )}
                            onClick={(e) => hasChildren && toggleRow(node.id, e)}
                        >
                            {isExpanded ? <ChevronDown className="w-3 h-3 text-gray-500" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                        </div>

                        {/* Icon */}
                        <div className="mr-2 text-gray-400">
                            {hasChildren ? <Folder className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                        </div>

                        <span className={cn("truncate font-medium text-gray-900", !hasChildren && "font-normal text-gray-700")}>
                            {node.title}
                        </span>

                        {/* URL hint */}
                        <span className="ml-2 text-[11px] text-gray-400 font-mono truncate hidden xl:inline-block opacity-60">
                            /{node.slug}
                        </span>
                    </div>

                    {/* Column 2: Status */}
                    <div className="flex justify-start">
                        <StatusBadge status={node.status} />
                    </div>

                    {/* Column 3: Language & Actions */}
                    <div className="flex justify-end items-center relative">
                        {/* Language Tag */}
                        <span className="text-[10px] font-mono text-gray-400 mr-2 uppercase">{node.language}</span>

                        {/* Hover Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-blue-600 hover:bg-blue-100/50"
                                onClick={(e) => { e.stopPropagation(); router.push(`/admin/pages/${node.id}` as any); }}
                                title="Edit"
                            >
                                <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                                onClick={(e) => { e.stopPropagation(); window.open(`/${node.slug}`, '_blank'); }}
                                title="View"
                            >
                                <Eye className="w-3 h-3" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-900">
                                        <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => router.push(`/admin/pages/${node.id}` as any)}>
                                        Edit Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.open(`/${node.slug}`, '_blank')}>
                                        View Live Page
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onClick={() => setPageToDelete(node)}
                                    >
                                        Delete Page
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="flex flex-col relative border-l border-gray-100 ml-[18px]">
                        {node.children.map(child => renderNode(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-white">

            {/* Header / Legend */}
            <div className="flex-shrink-0 h-10 flex items-center justify-between px-4 border-b border-gray-100 bg-white z-10">
                <div className="grid grid-cols-[1fr_100px_100px] w-full gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="pl-8">Page Title</div>
                    <div>Status</div>
                    <div className="text-right pr-2">Actions</div>
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
                        <span className="text-xs">Loading structure...</span>
                    </div>
                ) : treeData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                        <FileText className="w-8 h-8 opacity-10" />
                        <span className="text-sm text-gray-400">No pages found.</span>
                    </div>
                ) : (
                    <div className="py-0">
                        {treeData.map(node => renderNode(node))}
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Page?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{pageToDelete?.title}</strong>? This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deletePage} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
