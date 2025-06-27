import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingMenu from './FloatingMenu';
import { useAuth } from '@/hooks/useAuth';

const Layout: React.FC = () => {
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar - Hidden on mobile, block on md and up */}
      <div className="hidden md:block">
        {currentUser && <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />}
      </div>
      
      {/* Floating Menu for Mobile - Hidden on md and up */}
      <div className="md:hidden">
        {currentUser && <FloatingMenu />}
      </div>
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <main 
          id="main-content"
          className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900"
          role="main"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
