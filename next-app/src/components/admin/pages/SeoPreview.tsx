import React from 'react';
import { Progress } from "@/components/ui/progress";

interface SeoPreviewProps {
    title: string;
    description: string;
    slug: string;
}

export const SeoPreview = ({ title, description, slug }: SeoPreviewProps) => {
    // Guidelines
    const MAX_TITLE = 60;
    const MAX_DESC = 160;

    // Current Lengths
    const titleLen = title?.length || 0;
    const descLen = description?.length || 0;

    // Progress Calculations (cap at 100%)
    const titleProgress = Math.min((titleLen / MAX_TITLE) * 100, 100);
    const descProgress = Math.min((descLen / MAX_DESC) * 100, 100);

    // Color Logic (Green = Good, Red = Too Long/Short)
    const getProgressColor = (current: number, max: number) => {
        if (current === 0) return "bg-gray-200";
        if (current > max) return "bg-red-500";
        if (current > max * 0.8) return "bg-green-500"; // Sweet spot
        return "bg-amber-400"; // Too short
    };

    // Simulated URL
    const previewUrl = `https://globalhair.institute/${slug || 'example-page'}`;

    return (
        <div className="space-y-6 p-4 border rounded-lg bg-gray-50/50">
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Google Search Preview</h3>

                {/* Google Preview Card */}
                <div className="bg-white p-4 rounded shadow-sm border border-gray-100 max-w-[600px] font-sans">
                    {/* Site Name / Icon */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
                            <img src="https://GlobalHair.b-cdn.net/globalhair%20favicon4.png" alt="Favicon" className="w-4 h-4 object-contain" />
                        </div>
                        <div className="flex flex-col text-xs">
                            <span className="text-gray-800 font-normal">GlobalHair Institute</span>
                            <span className="text-gray-500">{previewUrl}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[#1a0dab] text-xl cursor-pointer hover:underline truncate mb-1 leading-snug">
                        {title || "Page Title | GlobalHair Institute"}
                    </h3>

                    {/* Description */}
                    <p className="text-[#4d5156] text-sm leading-relaxed line-clamp-2">
                        {description || "This is how your page description will appear in search results. Make it catchy and relevant to attract visitors."}
                    </p>
                </div>
            </div>

            {/* Analysis / Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {/* Title Analysis */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">SEO Title Width</span>
                        <span className={`${titleLen > MAX_TITLE ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                            {titleLen} / {MAX_TITLE} chars
                        </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${getProgressColor(titleLen, MAX_TITLE)}`}
                            style={{ width: `${Math.min((titleLen / (MAX_TITLE + 20)) * 100, 100)}%` }} // Scale nicely
                        />
                    </div>
                    <p className="text-[11px] text-gray-400">
                        Top keyword at start. Brand name at end. Keep under 60 chars.
                    </p>
                </div>

                {/* Description Analysis */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">Meta Description Width</span>
                        <span className={`${descLen > MAX_DESC ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                            {descLen} / {MAX_DESC} chars
                        </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${getProgressColor(descLen, MAX_DESC)}`}
                            style={{ width: `${Math.min((descLen / (MAX_DESC + 50)) * 100, 100)}%` }}
                        />
                    </div>
                    <p className="text-[11px] text-gray-400">
                        Include defined keywords. Make it actionable. Keep under 160 chars.
                    </p>
                </div>
            </div>
        </div>
    );
};
