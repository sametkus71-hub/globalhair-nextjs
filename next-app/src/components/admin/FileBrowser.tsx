'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Trash2, Image as ImageIcon, Film } from "lucide-react";
import { toast } from "sonner";

interface File {
  name: string;
  path: string;
  url: string;
  size: number;
  lastModified: string;
  isDirectory: boolean;
}

interface FileBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (url: string) => void;
  folder?: string;
}

export const FileBrowser = ({
  open,
  onOpenChange,
  onFileSelect,
  folder = "reviews",
}: FileBrowserProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/bunny-list?path=${folder}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load files");
      }

      const result = await response.json();
      setFiles(result.files.filter((f: File) => !f.isDirectory));
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadFiles();
    }
  }, [open, folder]);

  const handleDelete = async (path: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    setDeleting(path);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/bunny-delete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU',
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: `website-storage/${path}` }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      toast.success("File deleted successfully");
      loadFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    } finally {
      setDeleting(null);
    }
  };

  const handleSelect = (url: string) => {
    onFileSelect(url);
    onOpenChange(false);
    toast.success("File selected");
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] rounded-[1px]">
        <DialogHeader>
          <DialogTitle>Browse Files</DialogTitle>
          <p className="text-sm text-muted-foreground">Select a file from your Bunny CDN storage</p>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-[1px]"
            />
          </div>
          <Button
            variant="outline"
            onClick={loadFiles}
            disabled={loading}
            className="rounded-[1px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 overflow-y-auto max-h-[50vh]">
            {filteredFiles.map((file) => (
              <div
                key={file.path}
                className="group relative border-[1px] border-border rounded-[1px] overflow-hidden hover:border-blue-900 transition-colors"
              >
                <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
                  {file.name.match(/\.(mp4|webm)$/i) ? (
                    <>
                      <video
                        src={encodeURI(file.url)}
                        className="w-full h-full object-contain"
                        preload="metadata"
                        muted
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        onError={(e) => {
                          (e.target as HTMLVideoElement).style.display = "none";
                        }}
                      />
                      <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground pointer-events-none opacity-50" />
                    </>
                  ) : (
                    <img
                      src={encodeURI(file.url)}
                      alt={file.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="p-3 bg-background/95">
                  <p className="text-[10px] leading-tight line-clamp-2 mb-0.5" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-foreground/60 font-medium">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSelect(file.url)}
                    className="rounded-[1px]"
                  >
                    Select
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(file.path)}
                    disabled={deleting === file.path}
                    className="rounded-[1px]"
                  >
                    {deleting === file.path ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
