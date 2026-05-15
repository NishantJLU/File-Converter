import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const ToolCard = ({ title, description, href, icon: Icon, color }: ToolCardProps) => {
  return (
    <Link 
      href={href}
      className="group flex flex-col rounded-xl border bg-white dark:bg-gray-900 p-6 transition-all hover:shadow-lg hover:border-red-200 dark:border-gray-800 dark:hover:border-red-900"
    >
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${color} text-white transition-transform group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-black dark:text-white">{title}</h3>
      <p className="text-sm text-black dark:text-gray-400 line-clamp-2">{description}</p>
    </Link>
  );
};

export default ToolCard;
