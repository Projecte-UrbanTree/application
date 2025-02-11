import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import logo from '@resources/images/logo.png';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  contracts: { id: string; name: string }[];
  currentContract: string;
  currentPath: string;
  successMessage?: string;
  errorMessage?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  children,
  contracts,
  currentContract,
  currentPath,
  successMessage,
  errorMessage,
}) => {
  document.title = title
    ? `${title} - ${import.meta.env.VITE_APP_NAME}`
    : import.meta.env.VITE_APP_NAME;

  const [menuOpen, setMenuOpen] = useState(false);
  const [contract, setContract] = useState(currentContract);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleContractChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setContract(event.target.value);
  };

  const handleProfileClick = () => {
    const profileDropdown = document.getElementById('profile-dropdown');
    if (profileDropdown) {
      profileDropdown.classList.toggle('hidden');
    }
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      <header className="border-b bg-white shadow-md">
        <nav className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <a href="/" className="hidden sm:block">
            <img className="w-36 md:w-48" src={logo} alt="Logo" />
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden text-gray-700 focus:outline-none">
            <i className="fas fa-bars text-xl"></i>
          </button>

          <div className="hidden md:flex space-x-6">
            <a
              href="/admin"
              className={`text-sm text-gray-700 hover:text-gray-600 active:text-gray-700 ${
                currentPath.includes('/admin') &&
                !currentPath.includes('/admin/inventory')
                  ? 'font-semibold'
                  : ''
              }`}>
              <i className="fas fa-toolbox"></i> Gestión
            </a>
            <a
              href="/admin/inventory"
              className={`text-sm text-gray-700 hover:text-gray-600 active:text-gray-700 ${
                currentPath === '/admin/inventory' ? 'font-semibold' : ''
              }`}>
              <i className="fas fa-box-archive"></i> Inventario
            </a>
          </div>

          <div className="flex items-center gap-4">
            <select
              id="contractBtn"
              name="contractBtn"
              className="bg-white text-sm rounded-md p-2 text-right focus:outline-none"
              value={contract}
              onChange={handleContractChange}>
              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.name}
                </option>
              ))}
              <option value="-1">Todos los contratos</option>
            </select>

            <div className="relative">
              <div
                className="h-10 w-10 flex items-center justify-center bg-gray-300 text-gray-700 font-semibold text-lg rounded-full cursor-pointer"
                onClick={handleProfileClick}>
                IS
              </div>
              <div
                id="profile-dropdown"
                className="hidden absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black/5 z-10">
                <a
                  href="/admin/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configuración de la cuenta
                </a>
                <a
                  href="/license"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Licencia
                </a>
                <a
                  onClick={logout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cerrar sesión
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div
          className={`${menuOpen ? '' : 'hidden'} md:hidden px-4 py-4 bg-gray-100`}>
          <a
            href="/admin"
            className="block py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">
            <i className="fas fa-toolbox"></i> Gestión
          </a>
          <a
            href="/admin/inventory"
            className="block py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">
            <i className="fas fa-box-archive"></i> Inventario
          </a>
        </div>
      </header>

      <div
        id="submenu"
        className="md:flex overflow-x-auto flex-nowrap whitespace-nowrap items-center gap-4 px-4 py-4 bg-gray-100 shadow-md">
        <div className="submenu text-center flex items-center space-x-6 mx-auto">
          <a
            href="/admin/contracts"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-file-contract block"></i> Contratos
          </a>
          <a
            href="/admin/work-orders"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-briefcase block"></i> Órdenes de trabajo
          </a>
          <a
            href="/admin/element-types"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-cube block"></i> Tipos de elemento
          </a>
          <a
            href="/admin/tree-types"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-tree block"></i> Especies
          </a>
          <a
            href="/admin/task-types"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-tasks block"></i> Tipos de tarea
          </a>
          <a
            href="/admin/resources"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-box block"></i> Recursos
          </a>
          <a
            href="/admin/resource-types"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-solid fa-layer-group block"></i> Tipos de
            recursos
          </a>
          <a
            href="/admin/users"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-users block"></i> Usuarios
          </a>
          <a
            href="/admin/stats"
            className="text-sm text-gray-700 hover:text-gray-600 active:text-gray-700">
            <i className="fas fa-chart-bar block"></i> Estadísticas
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        {successMessage && (
          <div
            className="bg-green-400 text-white px-4 py-3 rounded mb-6 transform transition-all duration-500 ease-in-out"
            role="alert">
            <span className="inline-block mr-2">
              <i className="fas fa-check-circle w-5 h-5 text-white"></i>
            </span>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            className="bg-red-400 text-white px-4 py-3 rounded mb-6 transform transition-all duration-500 ease-in-out"
            role="alert">
            <span className="inline-block mr-2">
              <i className="fas fa-exclamation-circle w-5 h-5 text-white"></i>
            </span>
            <strong className="font-bold">Error:</strong> {errorMessage}
          </div>
        )}

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
