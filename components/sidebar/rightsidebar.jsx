import React from 'react';
import Link from 'next/link';

const TRENDING_TOPICS = [
  { id: 1, title: 'Startup Shutdown Stories', count: '1,234' },
  { id: 2, title: 'Interview Rejections', count: '956' },
  { id: 3, title: 'Project Pivots', count: '847' }
];

const FAILURE_CATEGORIES = [
  { id: 1, title: 'Tech Interviews' },
  { id: 2, title: 'Pitch Meetings' },
  { id: 3, title: 'Product Launches' }
];

export function RightSidebar() {
  return (
    <div className="w-80 fixed right-0 top-16 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto transition-colors">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trending Failures</h3>
        <div className="space-y-3">
          {TRENDING_TOPICS.map((topic) => (
            <Link 
              href={`/topic/${topic.id}`} 
              key={topic.id} 
              className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{topic.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{topic.count} people sharing</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">People Also Failed At</h3>
        <div className="space-y-3">
          {FAILURE_CATEGORIES.map((category) => (
            <Link
              href={`/category/${category.id}`}
              key={category.id}
              className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}