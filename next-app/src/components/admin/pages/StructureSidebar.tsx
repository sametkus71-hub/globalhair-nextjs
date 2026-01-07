'use client';

import { useState } from 'react';
import {
    Folder,
    Search,
    BookOpen,
    Layers,
    LayoutTemplate,
    ChevronDown,
    ChevronRight,
    Globe,
    Check,
    Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

export type StructureFilter =
    | 'all'
    | 'brand-hairtransplant'
    | 'brand-v6'
    | 'category-general'
    | 'category-seo'
    | 'category-blog'
    | 'category-uncategorized';

export type LanguageFilter = 'all' | 'nl' | 'en' | 'tr';

interface StructureSidebarProps {
    selectedFilter: StructureFilter;
    onSelect: (filter: StructureFilter) => void;
    selectedLanguage: LanguageFilter;
    onSelectLanguage: (lang: LanguageFilter) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    totalCount: number;
    counts: Record<string, number>;
}

export const StructureSidebar = ({
    selectedFilter,
    onSelect,
    selectedLanguage,
    onSelectLanguage,
    searchTerm,
    onSearchChange,
    totalCount,
    counts
}: StructureSidebarProps) => {

    const [brandsOpen, setBrandsOpen] = useState(true);

    const renderItem = (filter: StructureFilter, label: string, icon: React.ReactNode, countKey?: string, indentLevel = 0) => {
        const isSelected = selectedFilter === filter;
        const count = countKey ? counts[countKey] : undefined;

        return (
            <button
                onClick={() => onSelect(filter)}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 text-[13px] font-medium transition-all rounded-sm group relative",
                    indentLevel === 1 ? "pl-9" : "",
                    isSelected
                        ? "bg-black/5 text-black font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
            >
                {isSelected && <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-black rounded-r-full" />}

                <div className="flex items-center gap-2.5">
                    <div className={cn("text-gray-400 transition-colors", isSelected && "text-black")}>
                        {icon}
                    </div>
                    {label}
                </div>
                {count !== undefined && (
                    <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full transition-colors",
                        isSelected ? "bg-black/10 text-black" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    )}>
                        {count}
                    </span>
                )}
            </button>
        );
    };

    const getLangLabel = () => {
        switch (selectedLanguage) {
            case 'nl': return 'Dutch (NL)';
            case 'en': return 'English (EN)';
            case 'tr': return 'Turkish (TR)';
            default: return 'All Languages';
        }
    };

    return (
        <div className="w-[260px] flex-shrink-0 bg-white border-r border-gray-200 h-full flex flex-col">

            {/* Header Area */}
            <div className="p-3 space-y-3 border-b border-gray-100 bg-white z-20">
                {/* Language Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "w-full flex items-center justify-between px-3 py-1.5 border rounded text-[12px] font-medium transition-colors",
                            selectedLanguage !== 'all'
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}>
                            <span className="flex items-center gap-2">
                                <Globe className={cn("w-3.5 h-3.5", selectedLanguage !== 'all' ? "text-blue-500" : "text-gray-500")} />
                                {getLangLabel()}
                            </span>
                            <ChevronDown className={cn("w-3.5 h-3.5", selectedLanguage !== 'all' ? "text-blue-400" : "text-gray-400")} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[236px]">
                        <DropdownMenuItem onClick={() => onSelectLanguage('all')} className="flex justify-between">
                            All Languages {selectedLanguage === 'all' && <Check className="w-3 h-3" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSelectLanguage('nl')} className="flex justify-between">
                            Dutch (NL) {selectedLanguage === 'nl' && <Check className="w-3 h-3" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSelectLanguage('en')} className="flex justify-between">
                            English (EN) {selectedLanguage === 'en' && <Check className="w-3 h-3" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSelectLanguage('tr')} className="flex justify-between">
                            Turkish (TR) {selectedLanguage === 'tr' && <Check className="w-3 h-3" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Global Search */}
                <div className="relative group">
                    <Search className={cn(
                        "absolute left-2.5 top-2 w-3.5 h-3.5 transition-colors",
                        searchTerm ? "text-blue-500" : "text-gray-400 group-focus-within:text-gray-600"
                    )} />
                    <Input
                        placeholder="Search pages..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={cn(
                            "h-8 pl-8 text-xs transition-all font-medium border-transparent",
                            searchTerm
                                ? "bg-blue-50 focus:bg-white border-blue-100 ring-2 ring-blue-100/50"
                                : "bg-gray-50 focus:bg-white focus:border-gray-200"
                        )}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3">
                <div className="px-2 space-y-0.5">

                    {/* Collapsible Brands Group */}
                    <div className="mb-0.5">
                        <button
                            onClick={() => setBrandsOpen(!brandsOpen)}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                        >
                            <span className="flex items-center gap-1">
                                Brands
                            </span>
                            {brandsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>

                        {brandsOpen && (
                            <div className="mt-0.5 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                {renderItem('brand-hairtransplant', 'Hairtransplant', <Folder className="w-3.5 h-3.5" />, 'brand-hairtransplant', 1)}
                                {renderItem('brand-v6', 'V6 Hairboost', <Folder className="w-3.5 h-3.5" />, 'brand-v6', 1)}
                            </div>
                        )}
                    </div>

                    <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-4">
                        Content
                    </div>
                    {renderItem('category-general', 'General', <LayoutTemplate className="w-3.5 h-3.5" />, 'category-general')}
                    {renderItem('category-seo', 'SEO Pages', <Search className="w-3.5 h-3.5" />, 'category-seo')}
                    {renderItem('category-blog', 'Blog Pages', <BookOpen className="w-3.5 h-3.5" />, 'category-blog')}
                    {renderItem('category-uncategorized', 'Uncategorized', <LayoutTemplate className="w-3.5 h-3.5" />, 'category-uncategorized')}

                    <div className="my-3 border-t border-gray-100 mx-2" />

                    {renderItem('all', 'View All Pages', <Layers className="w-3.5 h-3.5" />, 'all')}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/30">
                <div className="text-[11px] font-medium text-gray-500 flex justify-between items-center px-1">
                    <span className="flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-gray-400" />
                        Total Pages
                    </span>
                    <span className="text-gray-900 font-semibold">{totalCount}</span>
                </div>
            </div>
        </div>
    );
};
