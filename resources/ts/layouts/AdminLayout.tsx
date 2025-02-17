import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import { Avatar } from 'primereact/avatar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import logo from '@images/logo.png';
import LangSelector from '@/components/LangSelector';
import { useI18n } from '@/hooks/useI18n';

interface AdminLayoutProps {
  titleI18n: string;
  children: React.ReactNode;
  contracts: { id: string; name: string }[];
  currentContract: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  titleI18n,
  children,
  contracts,
  currentContract,
}) => {
  const { t } = useI18n();
  document.title = titleI18n
    ? `${t(titleI18n)} - ${import.meta.env.VITE_APP_NAME}`
    : import.meta.env.VITE_APP_NAME;

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [contract, setContract] = useState(currentContract);
  const { user, logout } = useAuth();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const contractsWithAll = [
    ...contracts,
    { id: 'all', name: t('general.allContracts') },
  ];

  const handleContractChange = (e: DropdownChangeEvent): void => {
    setContract(e.target.value);
  };

  const handleProfileClick = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownVisible(false);
      }
    };

    if (profileDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownVisible]);

  return (
    <div>
      <header className="border-b border-gray-200 bg-white shadow-md">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <a href="#" className="hidden sm:block">
              <img className="w-36 md:w-52" src={logo} alt="Logo" />
            </a>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/admin/dashboard"
                className={`text-gray-700 hover:text-gray-600 hover:bg-gray-200 px-2 py-2 rounded active:text-gray-700 flex items-center gap-2 ${location.pathname !== '/admin/inventory' ? 'bg-gray-200 text-indigo-600' : ''}`}>
                <Icon
                  inline={true}
                  width="24px"
                  icon="tabler:adjustments-cog"
                />{' '}
                {t('admin.menu.management')}
              </Link>
              <Link
                to="/admin/dashboard"
                className={`text-gray-700 hover:text-gray-600 hover:bg-gray-200 px-2 py-2 rounded active:text-gray-700 flex items-center gap-2 ${location.pathname !== '/admin/inventory' ? 'bg-gray-200 text-indigo-600' : ''}`}>
                <Icon
                  inline={true}
                  width="24px"
                  icon="tabler:adjustments-cog"
                />{' '}
                {t('admin.menu.management')}
              </Link>
              <a
                href="#"
                className={`text-gray-700 hover:text-gray-600 hover:bg-gray-200 px-2 py-2 rounded active:text-gray-700 flex items-center gap-2 ${location.pathname === '/admin/inventory' ? 'bg-gray-200 text-indigo-600' : ''}`}>
                <Icon width="24px" icon="tabler:map-cog" />{' '}
                {t('admin.menu.inventory')}
              </a>
            </div>
          </div>

          <div className="block md:hidden">
            <Button
              onClick={() => setMenuOpen(!menuOpen)}
              color="text-gray-800">
              <Icon width="24px" icon="tabler:menu" color="#ffffff" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown
              id="contractBtn"
              name="contractBtn"
              className="w-48"
              value={contract}
              options={contractsWithAll}
              onChange={handleContractChange}
              optionLabel="name"
              optionValue="id"
            />
            <LangSelector />

            <div className="relative">
              <Avatar
                onClick={handleProfileClick}
                label={(user?.name?.[0] ?? '') + (user?.surname?.[0] ?? '')}
                size="large"
                shape="circle"
                className="cursor-pointer"
                style={{ color: '#fff', backgroundColor: '#8ccc63' }}
              />
              {profileDropdownVisible && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md ring-1 ring-black/5 z-10"
                  ref={profileRef}>
                  <a
                    href="/admin/account"
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin.profileDropdown.accountSettings')}
                  </a>
                  <a
                    href="/license"
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin.profileDropdown.license')}
                  </a>
                  <a
                    onClick={logout}
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin.profileDropdown.logout')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div
          className={`${menuOpen ? '' : 'hidden'} md:hidden px-4 py-4 bg-gray-100`}>
          <a
            href="/admin"
            className="block py-2 text-gray-700 hover:bg-gray-200 rounded flex items-center gap-2">
            <Icon width="24px" icon="tabler:adjustments-cog" />{' '}
            {t('admin.menu.management')}
          </a>
          <a
            href="/admin/inventory"
            className="block py-2 text-gray-700 hover:bg-gray-200 rounded flex items-center gap-2">
            <Icon width="24px" icon="tabler:map-cog" />{' '}
            {t('admin.menu.inventory')}
          </a>
        </div>
      </header>

      <div
        id="submenu"
        className="md:flex overflow-x-auto flex-nowrap whitespace-nowrap items-center gap-4 py-4 bg-gray-100 shadow-md">
        <div className="submenu text-center flex items-center space-x-6 mx-auto max-w-7xl">
          <Link
            to="/admin/contracts"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/contracts' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:file-description" />{' '}
            {t('admin.submenu.contracts')}
          </Link>
          <Link
            to="/admin/work-orders"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/work-orders' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:tools" />{' '}
            {t('admin.submenu.workOrders')}
          </Link>
          <Link
            to="/admin/element-types"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/element-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:box" />{' '}
            {t('admin.submenu.elementTypes')}
          </Link>
          <Link
            to="/admin/tree-types"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/tree-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:tree" />{' '}
            {t('admin.submenu.species')}
          </Link>
          <Link
            to="/admin/task-types"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/task-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:list-check" />{' '}
            {t('admin.submenu.taskTypes')}
          </Link>
          <Link
            to="/admin/resources"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/resources' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:package" />{' '}
            {t('admin.submenu.resources')}
          </Link>
          <Link
            to="/admin/resource-types"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/resource-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:package-export" />{' '}
            {t('admin.submenu.resourceTypes')}
          </Link>
          <Link
            to="/admin/users"
            className={`px-2 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/users' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:users" /> {t('admin.submenu.users')}
          </Link>
          <Link
            to="/admin/stats"
            className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/stats' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
            <Icon width="22px" icon="tabler:chart-bar" />{' '}
            {t('admin.submenu.stats')}
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto pt-8 pb-16">{children}</main>
    </div>
  );
};

export default AdminLayout;
