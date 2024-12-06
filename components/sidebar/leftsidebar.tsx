import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, BookOpen, TrendingUp } from 'lucide-react';
import { buttonVariants } from '../ui/button';

export function LeftSidebar() {
  return (
    <div className="hidden w-64 absolute left-0 top-16 h-screen bg-background dark:background border-r border-border dark:border-border p-4 transition-colors md:absolute">
      <div className="space-y-4">
        <div className="p-3 rounded-lg border border-border bg-background dark:bg-background">
          <h3 className="font-semibold text-primary dark:text-primary mb-2">Your Profile</h3>
          <p className="text-sm text-primary dark:text-primary">Share your failures to grow</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/network"
            className={buttonVariants({
              variant: 'ghost',
              className: 'flex items-center w-full p-3',
            })}
          >
            <Users className="h-5 w-5 mr-3" />
            <span>Network</span>
          </Link>
          <Link
            href="/jobs"
            className={buttonVariants({
              variant: 'ghost',
              className: 'flex items-center w-full p-3',
            })}
          >
            <Briefcase className="h-5 w-5 mr-3" />
            <span>Failed Jobs</span>
          </Link>
          <Link
            href="/learning"
            className={buttonVariants({
              variant: 'ghost',
              className: 'flex items-center w-full p-3',
            })}
          >
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Learning</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}