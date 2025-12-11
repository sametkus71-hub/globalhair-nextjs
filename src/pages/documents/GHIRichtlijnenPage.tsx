import PDFViewer from '@/components/documents/PDFViewer';

const GHIRichtlijnenPage = () => {
  return (
    <PDFViewer
      pdfUrl="https://GlobalHair.b-cdn.net/Bijlagen/GHI%20-%20Richtlijnen.pdf"
      title="GHI Richtlijnen"
      fileName="GHI Richtlijnen.pdf"
    />
  );
};

export default GHIRichtlijnenPage;
