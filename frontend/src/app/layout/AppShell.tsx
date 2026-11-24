import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <TopNav />
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
