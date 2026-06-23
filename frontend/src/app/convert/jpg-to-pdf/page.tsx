'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/config';
import { Image as ImageIcon, ArrowRight, Download, RefreshCw, Trash2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/Button';
import { ProgressDisplay } from '@/components/ui/Progress';

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setStatus('Uploading...');
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${API_URL}/api/convert/jpg-to-pdf`, formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) setStatus('Combining to PDF...');
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPdfUrl(url);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert images. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const reset = () => {
    setFiles([]);
    setPdfUrl(null);
    setStatus('');
  };

  const handleDelete = async () => {
    if (!pdfUrl) return;
    try {
      await axios.post(`${API_URL}/api/cleanup`, { files: ['images.pdf'] });
      reset();
    } catch (error) {
      console.error('Cleanup error:', error);
      reset();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-[calc(100vh-64px)] py-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white mb-4 shadow-lg">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">JPG to PDF</h1>
          <p className="text-gray-500 text-lg">Convert JPG images to PDF in seconds. Easily adjust orientation and margins.</p>
        </div>

        {!pdfUrl ? (
          <div className="flex flex-col items-center">
            <FileUpload 
              files={files} 
              setFiles={setFiles} 
              accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }} 
              multiple={true} 
            />
            
            {isProcessing && (
              <ProgressDisplay progress={uploadProgress} status={status} />
            )}

            {files.length > 0 && !isProcessing && (
              <div className="mt-12">
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-transform bg-red-600 hover:bg-red-700"
                  onClick={handleConvert}
                >
                  Convert to PDF
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
              <Download className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Images converted to PDF!</h2>
            <p className="text-gray-500 mb-8">Your new PDF document is ready for download.</p>
            
            <div className="flex flex-col gap-4">
              <a 
                href={pdfUrl} 
                download="images.pdf"
                className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                <Download className="h-6 w-6" />
                Download PDF
              </a>

              <button 
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 w-full bg-red-100 dark:bg-red-950/30 text-red-600 py-4 px-8 rounded-xl font-bold hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Delete from server now
              </button>
              
              <button 
                onClick={reset}
                className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white py-4 px-8 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
