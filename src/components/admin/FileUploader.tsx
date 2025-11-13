import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  accept?: string;
  maxSize?: number;
}

export const FileUploader = ({
  onUploadSuccess,
  folder = "reviews",
  accept = "image/*,video/*",
  maxSize = 10,
}: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showSizeWarning, setShowSizeWarning] = useState(false);

  const proceedWithUpload = useCallback(async (file: File) => {
    setUploading(true);
    setProgress(0);
    setUploadedUrl(null);

    try {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File too large. Maximum size is ${maxSize}MB.`);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload to Bunny CDN via edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://rjvgdqcbvikmjlrtraap.supabase.co/functions/v1/bunny-upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmdkcWNidmlrbWpscnRyYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM2ODksImV4cCI6MjA3NTc4OTY4OX0.gei_9L4GiAE5xukr7MrimWwSfEEOqH5hDpAN4TKCrdU',
          },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      setUploadedUrl(result.url);
      onUploadSuccess(result.url);
      toast.success("File uploaded successfully!");

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder, maxSize, onUploadSuccess]);

  const handleUpload = useCallback(async (file: File) => {
    // Check if image and > 1MB
    if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
      setPendingFile(file);
      setShowSizeWarning(true);
      return;
    }
    
    // Continue with upload
    proceedWithUpload(file);
  }, [proceedWithUpload]);

  const handleContinueAnyway = useCallback(() => {
    setShowSizeWarning(false);
    if (pendingFile) {
      proceedWithUpload(pendingFile);
      setPendingFile(null);
    }
  }, [pendingFile, proceedWithUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, [handleUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  }, [handleUpload]);

  const copyToClipboard = useCallback(() => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      toast.success("URL copied to clipboard!");
    }
  }, [uploadedUrl]);

  const clearUpload = useCallback(() => {
    setUploadedUrl(null);
    setProgress(0);
  }, []);

  if (uploadedUrl) {
    return (
      <div className="border-[1px] border-border rounded-[1px] p-4 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">Upload successful</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={uploadedUrl}
            readOnly
            className="flex-1 px-2 py-1 text-xs bg-muted rounded-[1px] border-[1px] border-border"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="rounded-[1px]"
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearUpload}
            className="rounded-[1px]"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`border-2 border-dashed rounded-[1px] p-6 transition-colors ${
          dragActive
            ? "border-blue-900 bg-blue-900/5"
            : "border-border hover:border-blue-900/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-muted-foreground" />
          
          {uploading ? (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-sm mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-900 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm font-medium">Drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum file size: {maxSize}MB
                </p>
              </div>
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-[1px]"
                  asChild
                >
                  <span>Select File</span>
                </Button>
              </label>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={showSizeWarning} onOpenChange={setShowSizeWarning}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-normal">De afbeelding is heel groot, wil je hem eerst comprimeren aub?</AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              asChild
              className="justify-start h-auto py-2 px-3 font-normal"
            >
              <a
                href="https://tinypng.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-3 h-3" />
                TinyPNG
              </a>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="justify-start h-auto py-2 px-3 font-normal"
            >
              <a
                href="https://imageresizer.com/image-compressor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-3 h-3" />
                Image Resizer
              </a>
            </Button>
          </div>

          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={handleContinueAnyway}
              className="font-normal"
            >
              Negeren en doorgaan
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
