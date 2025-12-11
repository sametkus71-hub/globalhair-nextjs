import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  fileName: string;
}

const PDFViewer = ({ pdfUrl, title, fileName }: PDFViewerProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-foreground font-medium text-lg truncate">{title}</h1>
        <Button 
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </header>

      {/* PDF Embed */}
      <div className="flex-1 w-full">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0`}
          className="w-full h-full min-h-[calc(100vh-60px)]"
          title={title}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
