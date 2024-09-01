'use client';
import React, { useState } from 'react';
// import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants';
import { cn } from '@/libs/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DashboardNav } from '../navigation-menu';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        {/* create an span with text Interface */}
        <span className="text-3xl font-semibold text-purple">interface</span>
      </div>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav navitems={navItems} className="hidden md:col-span-3 md:flex" />
          </div>
        </div>
      </div>
    </aside>
  );
}
