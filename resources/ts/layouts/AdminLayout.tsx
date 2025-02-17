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
        <nav className="flex items-center justify-between px-8 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="block md:hidden">
              <Button
                onClick={() => setMenuOpen(!menuOpen)}
                color="text-gray-800">
                <Icon width="24px" icon="tabler:menu" color="#ffffff" />
              </Button>
            </div>
            <a href="/" className="">
              <img className="w-48" src={logo} alt="Logo" />
            </a>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/admin/manage/dashboard"
                className={`text-gray-700 hover:text-gray-600 hover:bg-gray-200 px-2 py-2 rounded active:text-gray-700 flex items-center gap-2 ${location.pathname.includes('/admin/manage') ? 'bg-gray-200 text-indigo-600' : ''}`}>
                <Icon inline={true} width="24px" icon="tabler:briefcase" />{' '}
                {t('admin.menu.management')}
              </Link>
              <Link
                to="/admin/settings/contracts"
                className={`text-gray-700 hover:text-gray-600 hover:bg-gray-200 px-2 py-2 rounded active:text-gray-700 flex items-center gap-2 ${location.pathname.includes('/admin/settings') ? 'bg-gray-200 text-indigo-600' : ''}`}>
                <Icon inline={true} width="24px" icon="tabler:settings" />{' '}
                {t('admin.menu.settings')}
              </Link>
              <a
                href="#"
                className={`text-gray-700 hover:text-gray-600 hover:bg-gray-200 px-2 py-2 rounded active:text-gray-700 flex items-center gap-2 ${location.pathname === '/admin/inventory' ? 'bg-gray-200 text-indigo-600' : ''}`}>
                <Icon width="24px" icon="tabler:chart-treemap" />{' '}
                {t('admin.menu.inventory')}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
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
            </div>

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
          className={`${menuOpen ? '' : 'hidden'} md:hidden px-6 py-6 bg-gray-100`}>
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
          <div className="mt-4 flex flex-col gap-4">
            <Dropdown
              id="contractBtnMobile"
              name="contractBtnMobile"
              value={contract}
              options={contractsWithAll}
              onChange={handleContractChange}
              optionLabel="name"
              optionValue="id"
            />
            <LangSelector className="w-full" />
          </div>
        </div>
      </header>

      <div
        id="submenu"
        className="md:flex overflow-x-auto flex-nowrap whitespace-nowrap items-center gap-4 px-6 md:px-0 py-4 bg-gray-100 shadow-md">
        <div className="submenu text-center flex items-center mx-auto max-w-7xl">
          {location.pathname.includes('/admin/manage') && (
            <>
              {/* Manage submenu */}
              <Link
                to="/admin/manage/dashboard"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/manage/dashboard' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:layout-dashboard" />{' '}
                {t('admin.submenu.manage.dashboard')}
              </Link>
              <Link
                to="/admin/manage/work-orders"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/manage/work-orders' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:clipboard-text" />{' '}
                {t('admin.submenu.manage.workOrders')}
              </Link>
              <Link
                to="/admin/manage/stats"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/manage/stats' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:chart-pie-4" />{' '}
                {t('admin.submenu.manage.stats')}
              </Link>
            </>
          )}
          {location.pathname.includes('/admin/settings') && (
            <>
              {/* Settings submenu */}
              <Link
                to="/admin/settings/contracts"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/settings/contracts' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:file-description" />{' '}
                {t('admin.submenu.settings.contracts')}
              </Link>
              <Link
                to="/admin/settings/element-types"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/settings/element-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:box" />{' '}
                {t('admin.submenu.settings.elementTypes')}
              </Link>
              <Link
                to="/admin/settings/tree-types"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/settings/tree-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:tree" />{' '}
                {t('admin.submenu.settings.species')}
              </Link>
              <Link
                to="/admin/settings/task-types"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/settings/task-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:list-check" />{' '}
                {t('admin.submenu.settings.taskTypes')}
              </Link>
              <Link
                to="/admin/settings/resources"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/settings/resources' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:package" />{' '}
                {t('admin.submenu.settings.resources')}
              </Link>
              <Link
                to="/admin/settings/resource-types"
                className={`px-1 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/settings/resource-types' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:package-export" />{' '}
                {t('admin.submenu.settings.resourceTypes')}
              </Link>
              <Link
                to="/admin/settings/users"
                className={`px-2 py-3 rounded flex items-center gap-1 hover:bg-gray-200 ${location.pathname === '/admin/settings/users' ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
                <Icon width="22px" icon="tabler:users" />{' '}
                {t('admin.submenu.settings.users')}
              </Link>
            </>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto pt-8 pb-16">{children}</main>
    </div>
  );
};

export default AdminLayout;
