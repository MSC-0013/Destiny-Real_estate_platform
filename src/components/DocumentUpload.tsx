import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  documents: string[];
  onDocumentsChange: (documents: string[]) => void;
  label?: string;
  maxDocs?: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onDocumentsChange,
  label = "Documents",
  maxDocs = 5
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + documents.length > maxDocs) {
      toast({
        title: "Too many documents",
        description: `Maximum ${maxDocs} documents allowed`,
        variant: "destructive"
      });
      return;
    }

    files.forEach(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const docUrl = e.target?.result as string;
        onDocumentsChange([...documents, docUrl]);
        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = documents.filter((_, i) => i !== index);
    onDocumentsChange(newDocs);
  };

  const downloadDocument = (doc: string, index: number) => {
    const a = document.createElement('a');
    a.href = doc;
    a.download = `document-${index + 1}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      <Card
        className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-6 text-center">
          <Upload className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground mb-2">
            Upload documents (ID, contracts, certificates)
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, DOC, DOCX (Max 10MB each, {maxDocs} docs max)
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-3">
            <FileText className="mr-2 h-4 w-4" />
            Choose Documents
          </Button>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Document {index + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadDocument(doc, index)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {documents.length} of {maxDocs} documents uploaded
      </p>
    </div>
  );
};

export default DocumentUpload;