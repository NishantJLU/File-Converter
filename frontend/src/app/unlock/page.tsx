'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Unlock, ArrowRight, Download, RefreshCw, Trash2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/Button';
import { ProgressDisplay } from '@/components/ui/Progress';

export default function UnlockPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [unlockedFileUrl, setUnlockedFileUrl] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setStatus('Uploading...');
    
    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const response = await axios.post('http://localhost:5000/api/unlock', formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) setStatus('Removing restrictions...');
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setUnlockedFileUrl(url);
    } catch (error) {
      console.error('Unlock error:', error);
      alert('Failed to unlock PDF. It might have a strong password.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const reset = () => {
    setFiles([]);
    setUnlockedFileUrl(null);
    setStatus('');
  };

  const handleDelete = async () => {
    if (!unlockedFileUrl) return;
    try {
      await axios.post('http://localhost:5000/api/cleanup', { files: ['unlocked.pdf'] });
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-white mb-4 shadow-lg">
            <Unlock className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">Unlock PDF</h1>
          <p className="text-gray-500 text-lg">Remove PDF password security, so you can use your PDFs however you want.</p>
        </div>

        {!unlockedFileUrl ? (
          <div className="flex flex-col items-center">
            <FileUpload files={files} setFiles={setFiles} multiple={false} />
            
            {isProcessing && (
              <ProgressDisplay progress={uploadProgress} status={status} />
            )}

            {files.length > 0 && !isProcessing && (
              <div className="mt-12">
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-transform bg-gray-800 hover:bg-black"
                  onClick={handleUnlock}
                >
                  Unlock PDF
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
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">PDF unlocked!</h2>
            <p className="text-gray-500 mb-8">Security restrictions have been removed.</p>
            
            <div className="flex flex-col gap-4">
              <a 
                href={unlockedFileUrl} 
                download="unlocked.pdf"
                className="flex items-center justify-center gap-2 w-full bg-gray-800 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-black transition-colors shadow-lg"
              >
                <Download className="h-6 w-6" />
                Download unlocked PDF
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
