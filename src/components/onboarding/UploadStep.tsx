import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Props {
  data: any;
  onDataUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  user?: any;
}

export default function UploadStep({ data, onDataUpdate, onNext, onBack }: Props) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      onDataUpdate({ resume_url: file.name });
    }
  }, [onDataUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleNext = () => {
    if (uploadedFile) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 text-primary border-primary/20">
          Step 2 of 4
        </Badge>
        <h1 className="text-3xl font-bold mb-4">
          Upload Your Resume
        </h1>
        <p className="text-muted-foreground">
          Share your experience and qualifications to help us match you with the right opportunities.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Upload
          </CardTitle>
          <CardDescription>
            Upload your resume in PDF, DOC, or DOCX format (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary font-medium">Drop your resume here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop your resume here
                </p>
                <p className="text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {uploadedFile.name} uploaded successfully
                </span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                File size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!uploadedFile}
          className="gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}