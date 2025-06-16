import React from 'react';
import { useRouter } from 'next/router';

interface AdminHeaderProps {
  onLogout?: () => void;
  title?: string;
}

export default function AdminHeader({ onLogout, title = "Painel do Administrador" }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    if (onLogout) onLogout();
  };

  return (
    <header>
      <nav className="bg-gray-800 border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              {title}
            </span>
          </div>
          <div className="flex items-center lg:order-2">
            <button
              onClick={handleLogout}
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}