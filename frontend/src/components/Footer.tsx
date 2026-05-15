import React from 'react';
import { FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-zinc-950 border-t dark:border-gray-800 py-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-bold text-black dark:text-white mb-4">
              <FileText className="h-6 w-6 text-red-600" />
              <span className="text-lg uppercase tracking-tighter">File Converter</span>
            </div>

            <p className="text-black dark:text-gray-400 text-sm max-w-xs mb-6">
              Your every PDF solution in one place. Merge, split, compress, and convert PDFs with ease.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase text-black dark:text-white">Solutions</h4>
            <ul className="space-y-2 text-sm text-black dark:text-gray-400">
              <li><a href="#" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Merge PDF</a></li>
              <li><a href="#" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Split PDF</a></li>
              <li><a href="#" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">Compress PDF</a></li>
              <li><a href="#" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">PDF to Word</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t dark:border-gray-800 text-center text-sm text-black dark:text-gray-500">
          <p>© {new Date().getFullYear()} File Converter. Made with ❤️ for PDF lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
