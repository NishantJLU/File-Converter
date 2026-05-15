import React from 'react';
import { 
  Merge, 
  Scissors, 
  Zap, 
  FileEdit, 
  FileSearch, 
  FileText, 
  Lock, 
  Unlock, 
  RotateCw,
  Image as ImageIcon,
  Type
} from 'lucide-react';
import ToolCard from '@/components/ToolCard';

const tools = [
  {
    title: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    href: "/merge",
    icon: Merge,
    color: "bg-red-500"
  },
  {
    title: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    href: "/split",
    icon: Scissors,
    color: "bg-orange-500"
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    href: "/compress",
    icon: Zap,
    color: "bg-blue-500"
  },
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
  },
  {
    title: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document.",
    href: "/edit",
    icon: Type,
    color: "bg-red-400"
  },
  {
    title: "Unlock PDF",
    description: "Remove PDF password security, so you can use your PDFs however you want.",
    href: "/unlock",
    icon: Unlock,
    color: "bg-gray-800"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col transition-colors dark:bg-black">
      {/* Hero Section */}
      <section className="bg-white dark:bg-black py-16 text-center md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-black dark:text-white md:text-6xl">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-black dark:text-gray-400 md:text-xl">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="bg-gray-50 dark:bg-zinc-950 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-black py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-16 text-3xl font-bold text-black dark:text-white">The PDF software millions of users trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <div className="mb-4 text-black dark:text-white font-bold text-xl flex items-center gap-2">
                <FileSearch className="h-6 w-6 text-red-600" />
                <span>Searchable</span>
              </div>
              <p className="text-black dark:text-gray-400">
                Easily find and manipulate your documents with our intuitive search and organization tools.
              </p>
            </div>
            <div>
              <div className="mb-4 text-black dark:text-white font-bold text-xl flex items-center gap-2">
                <Lock className="h-6 w-6 text-red-600" />
                <span>Secure</span>
              </div>
              <p className="text-black dark:text-gray-400">
                Your files are protected with high-level encryption and are automatically deleted after processing.
              </p>
            </div>
            <div>
              <div className="mb-4 text-black dark:text-white font-bold text-xl flex items-center gap-2">
                <RotateCw className="h-6 w-6 text-red-600" />
                <span>Fast</span>
              </div>
              <p className="text-black dark:text-gray-400">
                Our high-performance servers ensure your files are processed in seconds, not minutes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
