import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { UploadedFile } from "@/types";
import * as pdfjs from 'pdfjs-dist';

const initPdfWorker = () => {
  import('pdfjs-dist/build/pdf.worker.entry')
    .then(workerModule => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
    })
    .catch(error => {
      console.error("Error loading PDF.js worker:", error);
    });
};

interface UploadSectionProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFilesUploaded, uploadedFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    initPdfWorker();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    []
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const getPageCount = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error("Error counting PDF pages:", error);
      return 0;
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => file.type === "application/pdf");
    
    if (validFiles.length === 0) {
      toast.error("Please upload PDF files only");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(Math.min(progress, 90));
      
      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 50);
    
    try {
      const processedFiles: UploadedFile[] = [];
      
      for (const file of validFiles) {
        const pageCount = await getPageCount(file);
        
        processedFiles.push({
          id: crypto.randomUUID(),
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          pages: pageCount,
        });
      }
      
      setUploadProgress(100);
      onFilesUploaded([...uploadedFiles, ...processedFiles]);
      toast.success(`Successfully uploaded ${validFiles.length} file(s)`);
    } catch (error) {
      toast.error("Error processing PDF files");
      console.error("PDF processing error:", error);
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    onFilesUploaded(updatedFiles);
    toast.info("File removed");
  };

  const handleReset = () => {
    onFilesUploaded([]);
    toast.success("All files cleared");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Upload PDF Files</h2>
        {uploadedFiles.length > 0 && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors"
          >
            Clear All Files
          </Button>
        )}
      </div>
      
      <div
        className={`drop-zone ${isDragging ? "active" : ""} ${uploadedFiles.length > 0 ? 'mb-6' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <svg className="w-12 h-12 text-purple mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mb-2 text-lg font-medium">
          Drag & drop PDF files here
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          or
        </p>
        <Button
          variant="outline"
          className="bg-white hover:bg-accent relative cursor-pointer transition-colors"
          disabled={isUploading}
        >
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          Browse Files
        </Button>
      </div>
      
      {isUploading && (
        <div className="mt-4 bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-purple" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading files...
          </p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Uploaded Files</h3>
              <p className="text-sm text-muted-foreground">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
          </div>
          
          <div className="divide-y">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="bg-purple/10 rounded-lg p-2 mr-3">
                      <svg className="w-6 h-6 text-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium truncate">{file.name}</h4>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDate(file.uploadedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                        <span>{file.pages} page{file.pages !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="ml-4 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;