import React from 'react';
import { 
  FileEdit, 
  Image as ImageIcon 
} from 'lucide-react';
import ToolCard from '@/components/ToolCard';

const convertTools = [
  {
    title: "PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    href: "/convert/pdf-to-word",
    icon: FileEdit,
    color: "bg-blue-600"
  },
  {
    title: "PDF to JPG",
    description: "Extract all images that are within a PDF or convert each page to a JPG image.",
    href: "/convert/pdf-to-jpg",
    icon: ImageIcon,
    color: "bg-yellow-500"
  },
  {
    title: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    href: "/convert/jpg-to-pdf",
    icon: ImageIcon,
    color: "bg-red-600"
  }
];

export default function ConvertPage() {
  return (
    <div className="flex flex-col min-h-screen transition-colors dark:bg-black">
      {/* Hero Section */}
      <section className="bg-white dark:bg-black py-16 text-center md:py-24">
        <div className="container mx-auto px-4">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-red-600 uppercase bg-red-100 rounded-full dark:bg-red-950 dark:text-red-300">
            Convert Files
          </span>
          <h1 className="mt-4 mb-6 text-4xl font-extrabold tracking-tight text-black dark:text-white md:text-5xl">
            Convert to and from PDF
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-black dark:text-gray-400 md:text-xl">
            Convert files with absolute security. Fast, accurate, and completely free converters at your disposal.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="bg-gray-50 dark:bg-zinc-950 py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {convertTools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
