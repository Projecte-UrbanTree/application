import React from 'react';
import logo from '@resources/images/logo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  document.title = title
    ? `${title} - ${import.meta.env.VITE_APP_NAME}`
    : import.meta.env.VITE_APP_NAME;

  return (
    <div className="font-sans leading-normal tracking-normal flex items-center justify-center h-screen p-2 md:p-0">
      <div className="w-full max-w-lg bg-white rounded p-8 border border-gray-200">
        {/* Header with Logo */}
        <header className="text-center my-8">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-48 md:w-64" />
        </header>
        {/* Main content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
