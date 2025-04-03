"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Admin sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">KaTuripu Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin" 
                className={`block p-2 rounded ${pathname === '/admin' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/roadmaps" 
                className={`block p-2 rounded ${pathname.startsWith('/admin/roadmaps') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                Roadmaps
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
