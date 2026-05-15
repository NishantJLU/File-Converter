'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Scissors, ArrowRight, Download, RefreshCw, Trash2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/Button';
import { ProgressDisplay } from '@/components/ui/Progress';

export default function SplitPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  const handleSplit = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const response = await axios.post('http://localhost:5000/api/split', formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) {
            setStatus('Processing PDF...');
          }
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setZipUrl(url);
    } catch (error) {
      console.error('Split error:', error);
      alert('Failed to split PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const reset = () => {
    setFiles([]);
    setZipUrl(null);
    setStatus('');
  };

  const handleDelete = async () => {
    if (!zipUrl) return;
    try {
      await axios.post('http://localhost:5000/api/cleanup', { files: ['split_pages.zip'] });
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white mb-4 shadow-lg">
            <Scissors className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">Split PDF file</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Separate one page or a whole set for easy conversion into independent PDF files.</p>
        </div>

        {!zipUrl ? (
          <div className="flex flex-col items-center">
            <FileUpload files={files} setFiles={setFiles} multiple={false} />
            
            {isProcessing && (
              <ProgressDisplay progress={uploadProgress} status={status} />
            )}

            {files.length > 0 && !isProcessing && (
              <div className="mt-12">
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-transform bg-orange-500 hover:bg-orange-600"
                  onClick={handleSplit}
                  isLoading={isProcessing}
                >
                  Split PDF
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
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">PDF has been split!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">All pages have been separated into a ZIP file.</p>
            
            <div className="flex flex-col gap-4">
              <a 
                href={zipUrl} 
                download="split_pages.zip"
                className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg"
              >
                <Download className="h-6 w-6" />
                Download ZIP file
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
