'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/config';
import { Merge, ArrowRight, Download, RefreshCw, ShieldAlert, Trash2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/Button';
import { ProgressDisplay } from '@/components/ui/Progress';

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setStatus('Uploading...');
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${API_URL}/api/merge`, formData, {
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
      setMergedFileUrl(url);
    } catch (error) {
      console.error('Merge error:', error);
      alert('Failed to merge PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const reset = () => {
    setFiles([]);
    setMergedFileUrl(null);
    setStatus('');
  };

  const handleDelete = async () => {
    if (!mergedFileUrl) return;
    try {
      await axios.post(`${API_URL}/api/cleanup`, { files: ['merged.pdf'] });
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white mb-4 shadow-lg">
            <Merge className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">Merge PDF files</h1>
          <p className="text-gray-500 text-lg">Combine PDFs in the order you want with the easiest PDF merger available.</p>
        </div>

        {!mergedFileUrl ? (
          <div className="flex flex-col items-center">
            <FileUpload files={files} setFiles={setFiles} />
            
            {isProcessing && (
              <ProgressDisplay progress={uploadProgress} status={status} />
            )}

            {files.length >= 2 && !isProcessing && (
              <div className="mt-12 flex flex-col items-center">
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-transform"
                  onClick={handleMerge}
                  isLoading={isProcessing}
                >
                  Merge PDF
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <p className="mt-4 text-sm text-black dark:text-gray-400">Files will be merged in the order shown above</p>
              </div>
            )}
            
            {files.length === 1 && (
              <p className="mt-8 text-black dark:text-red-500 font-medium text-center">Please add at least one more PDF file to merge.</p>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
              <Download className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">PDFs have been merged!</h2>
            <p className="text-gray-500 mb-8">Your new PDF document is ready for download.</p>
            
            <div className="flex flex-col gap-4">
              <a 
                href={mergedFileUrl} 
                download="merged.pdf"
                className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                <Download className="h-6 w-6" />
                Download merged PDF
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
