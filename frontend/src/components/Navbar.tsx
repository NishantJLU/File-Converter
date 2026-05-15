'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b bg-white dark:bg-black dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-black dark:text-white">
          <FileText className="h-8 w-8 text-red-600" />
          <span className="text-xl uppercase tracking-tighter">File Converter</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/merge" className="text-sm font-bold text-black dark:text-white hover:opacity-70">MERGE PDF</Link>
          <Link href="/split" className="text-sm font-bold text-black dark:text-white hover:opacity-70">SPLIT PDF</Link>
          <Link href="/compress" className="text-sm font-bold text-black dark:text-white hover:opacity-70">COMPRESS PDF</Link>
          <Link href="/convert" className="text-sm font-bold text-black dark:text-white hover:opacity-70">CONVERT PDF</Link>
        </div>
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-black" />}
            </button>
          )}
          <Link href="/login" className="text-sm font-bold text-black dark:text-white hover:opacity-70 transition-opacity">Log In</Link>
          <Link href="/signup" className="rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-bold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
