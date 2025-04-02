import LangSelector from '@/components/LangSelector';
import logo from '@images/logo.png';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="font-sans leading-normal tracking-normal flex items-center justify-center h-screen p-2 md:p-0">
      <div className="w-full max-w-xl bg-white rounded p-8 border border-gray-200">
        <div className="flex justify-end">
          <LangSelector />
        </div>
        <header className="text-center my-8">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-48 md:w-64" />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
