import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, BookOpen, TrendingUp } from 'lucide-react';

export function LeftSidebar() {
  return (
    <div className="w-64 fixed left-0 top-16 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto transition-colors">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Profile</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Share your failures to grow</p>
        </div>

        <nav className="space-y-2">
          <Link href="/network" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Users className="h-5 w-5 mr-3" />
            <span>Network</span>
          </Link>
          <Link href="/jobs" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Briefcase className="h-5 w-5 mr-3" />
            <span>Failed Jobs</span>
          </Link>
          <Link href="/learning" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Learning</span>
          </Link>
          <Link href="/growth" className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <TrendingUp className="h-5 w-5 mr-3" />
            <span>Growth</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}