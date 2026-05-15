'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, GripVertical } from 'lucide-react';
import { Button } from './ui/Button';
import { generateThumbnail } from '@/lib/utils/pdf';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FileWithThumbnail extends File {
  thumbnail?: string;
  id: string;
}

interface FileUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

interface SortableFileItemProps {
  file: FileWithThumbnail;
  index: number;
  onRemove: (id: string) => void;
}

const SortableFileItem = ({ file, id, index, onRemove }: SortableFileItemProps & { id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative flex flex-col items-center rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 p-4 text-center shadow-sm group"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-2 top-2 cursor-grab active:cursor-grabbing text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <button 
        onClick={() => onRemove(file.id)}
        className="absolute -right-2 -top-2 rounded-full bg-gray-900 dark:bg-red-600 p-1 text-white hover:bg-red-600 dark:hover:bg-red-700 shadow-md z-10"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="mb-2 h-24 w-full flex items-center justify-center overflow-hidden rounded bg-gray-50 dark:bg-black">
        {file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} className="h-full w-full object-contain" />
        ) : (
          <div className="text-red-500">
            <FileText className="h-12 w-12" />
          </div>
        )}
      </div>
      
      <p className="w-full truncate text-xs font-bold text-black dark:text-white">{file.name}</p>
      <p className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
    </div>
  );
};

const FileUpload = ({ files, setFiles, accept = { 'application/pdf': ['.pdf'] }, multiple = true }: FileUploadProps) => {
  const [enhancedFiles, setEnhancedFiles] = useState<FileWithThumbnail[]>([]);

  // Sync internal state with props
  useEffect(() => {
    const processFiles = async () => {
      const newFiles: FileWithThumbnail[] = [];
      
      for (const file of files) {
        const existing = enhancedFiles.find(f => f.name === file.name && f.size === file.size);
        if (existing) {
          newFiles.push(existing);
          continue;
        }

        const fileWithId = file as FileWithThumbnail;
        fileWithId.id = `${file.name}-${file.size}-${Date.now()}`;
        
        if (file.type === 'application/pdf') {
          try {
            fileWithId.thumbnail = await generateThumbnail(file);
          } catch (e) {
            console.error('Thumbnail error:', e);
          }
        } else if (file.type.startsWith('image/')) {
          fileWithId.thumbnail = URL.createObjectURL(file);
        }
        
        newFiles.push(fileWithId);
      }
      setEnhancedFiles(newFiles);
    };

    processFiles();
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (multiple) {
      setFiles(prev => [...prev, ...acceptedFiles]);
    } else {
      setFiles(acceptedFiles);
    }
  }, [multiple, setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  const removeFile = (id: string) => {
    setFiles(prev => {
      const index = enhancedFiles.findIndex(f => f.id === id);
      return prev.filter((_, i) => i !== index);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = enhancedFiles.findIndex(f => f.id === active.id);
      const newIndex = enhancedFiles.findIndex(f => f.id === over.id);
      
      const newFiles = arrayMove(files, oldIndex, newIndex);
      setFiles(newFiles);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors
          ${isDragActive ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
      >
        <input {...getInputProps()} />
        <div className="mb-4 rounded-full bg-red-100 dark:bg-red-900/30 p-4 text-red-600">
          <Upload className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
          {isDragActive ? 'Drop files here' : 'Select PDF files'}
        </h2>
        <p className="text-gray-500">or drag and drop PDFs here</p>
        <Button variant="primary" size="lg" className="mt-6 font-bold uppercase tracking-wide">
          Select PDF files
        </Button>
      </div>

      {enhancedFiles.length > 0 && (
        <div className="mt-8">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={enhancedFiles.map(f => f.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {enhancedFiles.map((file, index) => (
                  <SortableFileItem 
                    key={file.id} 
                    id={file.id}
                    file={file} 
                    index={index} 
                    onRemove={removeFile} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {multiple && enhancedFiles.length > 1 && (
            <p className="mt-4 text-center text-sm text-gray-500 italic">Drag to reorder files</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
