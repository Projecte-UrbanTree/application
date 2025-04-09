import { Icon } from '@iconify/react';
import logo from '@images/logo.png';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import LangSelector from '@/components/LangSelector';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { fetchAllContracts, selectContract } from '@/store/slice/contractSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Contract } from '@/types/Contract';

const SELECTED_CONTRACT_KEY = 'selectedContractId';

const defaultContract: Contract = {
  id: 0,
  name: 'Ver todos',
  status: 1,
};

interface AdminLayoutProps {
  titleI18n: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, titleI18n }) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { allContracts, currentContract } = useSelector(
    (state: RootState) => state.contract,
  );

  const isInventoryPage = location.pathname.includes('/admin/inventory');
  const isWorkersPage = location.pathname.includes('/admin/workers');
  const activeContracts = allContracts.filter(
    (contract) => contract.status === 0,
  );
  const contracts =
    isInventoryPage || isWorkersPage
      ? activeContracts
      : [defaultContract, ...activeContracts];

  const isManagementActive = [
    '/admin/dashboard',
    '/admin/work-orders',
    '/admin/eva',
    '/admin/workers',
    '/admin/resources',
    '/admin/statistics',
    '/admin/sensors',
    '/admin/work-reports',
  ].some((path) => location.pathname.startsWith(path));

  const isSettingsPage = location.pathname.includes('/admin/settings');
  const isWorkOrderEditPage = location.pathname.includes(
    '/admin/work-orders/edit/',
  );
  const isResourceEditPage = location.pathname.includes(
    '/admin/resources/edit/',
  );
  const isAccountPage = location.pathname.includes('/admin/account');

  const hideContractSelector =
    isSettingsPage ||
    isWorkOrderEditPage ||
    isResourceEditPage ||
    isAccountPage;

  useEffect(() => {
    dispatch(fetchAllContracts());
  }, [dispatch]);

  useEffect(() => {
    document.title = `${t(titleI18n)} - ${import.meta.env.VITE_APP_NAME}`;
  }, [titleI18n, t]);

  useEffect(() => {
    if ((isInventoryPage || isWorkersPage) && 
        activeContracts.length > 0 && 
        !initialized) {

      const savedContractId = localStorage.getItem(SELECTED_CONTRACT_KEY);

      if (savedContractId) {
        const contractId = parseInt(savedContractId);
        const contractExists = activeContracts.some(c => c.id === contractId);

        if (contractExists) {
          dispatch(selectContract(contractId));
          setInitialized(true);
          return;
        }
      }

      if (!currentContract && !savedContractId) {
        dispatch(selectContract(activeContracts[0]?.id ?? 0));
      }

      setInitialized(true);
    }
  }, [isInventoryPage, isWorkersPage, activeContracts.length, initialized]);

  const handleContractChange = useCallback(
    (e: DropdownChangeEvent) => {
      const newContractId = e.value;
      dispatch(selectContract(newContractId));
      localStorage.setItem(SELECTED_CONTRACT_KEY, newContractId.toString());
    },
    [dispatch],
  );

  const handleProfileClick = () => setProfileDropdownVisible((prev) => !prev);

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
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileDropdownVisible]);

  const mobileNavItems = [
    {
      to: '/admin/dashboard',
      label: t('admin.menu.management'),
      icon: 'tabler:briefcase',
      active: isManagementActive,
    },
    {
      to: '/admin/inventory',
      label: t('admin.menu.inventory'),
      icon: 'tabler:chart-treemap',
      active: isInventoryPage,
    },
    {
      to: '/admin/settings/contracts',
      label: t('admin.menu.settings'),
      icon: 'tabler:settings',
      active: isSettingsPage,
    },
  ];

  const managementSubmenuItems = [
    {
      to: '/admin/dashboard',
      label: t('admin.submenu.manage.dashboard'),
      icon: 'tabler:layout-dashboard',
    },
    {
      to: '/admin/evas',
      label: t('admin.submenu.manage.eva'),
      icon: 'tabler:chart-bar',
    },
    {
      to: '/admin/work-orders',
      label: t('admin.submenu.manage.workOrders'),
      icon: 'tabler:clipboard-text',
    },
    {
      to: '/admin/workers',
      label: t('admin.submenu.manage.workers'),
      icon: 'tabler:users',
    },
    {
      to: '/admin/resources',
      label: t('admin.submenu.manage.resources'),
      icon: 'tabler:package',
    },
    {
      to: '/admin/statistics',
      label: t('admin.submenu.manage.stats'),
      icon: 'tabler:chart-pie-4',
    },
    {
      to: '/admin/sensors',
      label: t('admin.submenu.manage.sensors'),
      icon: 'tabler:device-analytics',
    },
  ];

  const settingsSubmenuItems = [
    {
      to: '/admin/settings/contracts',
      label: t('admin.submenu.settings.contracts'),
      icon: 'tabler:file-description',
    },
    {
      to: '/admin/settings/element-types',
      label: t('admin.submenu.settings.elementTypes'),
      icon: 'tabler:box',
    },
    {
      to: '/admin/settings/tree-types',
      label: t('admin.submenu.settings.species'),
      icon: 'tabler:tree',
    },
    {
      to: '/admin/settings/task-types',
      label: t('admin.submenu.settings.taskTypes'),
      icon: 'tabler:list-check',
    },
    {
      to: '/admin/settings/resource-types',
      label: t('admin.submenu.settings.resourceTypes'),
      icon: 'tabler:package-export',
    },
    {
      to: '/admin/settings/users',
      label: t('admin.submenu.settings.users'),
      icon: 'tabler:users',
    },
  ];

  const padding = isInventoryPage
    ? 'p-0' // Remove all padding for inventory
    : 'max-w-7xl mx-auto pt-8 pb-16 px-8';

  return (
    <div className={isInventoryPage ? 'flex flex-col h-screen overflow-hidden' : ''}>
      <header className="border-b border-gray-300 bg-white shadow-md">
        <nav className="flex items-center justify-between px-8 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="block lg:hidden">
              <Button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-800">
                <Icon icon="tabler:menu" className="h-5 w-5 text-white" />
              </Button>
            </div>
            <a href="/" className="flex-none">
              <img className="w-48" src={logo} alt="Logo" />
            </a>
          </div>
          <div className="hidden lg:flex flex-1 items-center space-x-6 mx-4">
            {mobileNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-gray-800 px-4 py-3 rounded flex items-center gap-2 ${
                  item.active ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
                }`}>
                <Icon icon={item.icon} className="h-5 w-5" /> {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex gap-4">
              {!hideContractSelector && (
                <Dropdown
                  id="contractBtn"
                  className="w-40"
                  value={currentContract?.id ?? 0}
                  options={contracts}
                  onChange={handleContractChange}
                  optionLabel="name"
                  optionValue="id"
                />
              )}
              <LangSelector />
            </div>
            <div className="relative">
              <Avatar
                onClick={handleProfileClick}
                label={`${user?.name?.[0] ?? ''}${user?.surname?.[0] ?? ''}`}
                size="large"
                shape="circle"
                className="cursor-pointer"
                style={{ color: '#fff', backgroundColor: '#4f46e5' }}
              />
              {profileDropdownVisible && (
                <div
                  ref={profileRef}
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md ring-1 ring-black/5 z-10">
                  <Link
                    onClick={() => setProfileDropdownVisible(false)}
                    to="/admin/account"
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin.profileDropdown.accountSettings')}
                  </Link>
                    <Link
                    onClick={() => setProfileDropdownVisible(false)}
                    to="/admin/license"
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin.profileDropdown.license')}
                    </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin.profileDropdown.logout')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
        <div
          className={`${menuOpen ? '' : 'hidden'} lg:hidden px-8 py-6 bg-gray-100`}>
          <div className="mt-4 flex flex-col gap-4">
            {!hideContractSelector && (
              <Dropdown
                id="contractBtn"
                className="w-40"
                value={currentContract?.id ?? 0}
                options={contracts}
                onChange={handleContractChange}
                optionLabel="name"
                optionValue="id"
              />
            )}
            <LangSelector className="w-full" />
          </div>
        </div>
      </header>

      {!isAccountPage && (
        <div
          id="submenu"
          className="lg:flex overflow-x-auto flex-nowrap whitespace-nowrap items-center gap-2 lg:gap-4 px-8 py-4 bg-white border-b border-gray-300 shadow-sm">
          <div className="submenu text-center flex items-center gap-2 lg:gap-4 mx-auto max-w-7xl">
            {isManagementActive &&
              managementSubmenuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2 py-3 rounded flex items-center gap-1 ${
                    location.pathname.includes(item.to)
                      ? 'bg-white border border-gray-300 text-indigo-600'
                      : 'text-gray-600 hover:bg-white hover:border hover:border-gray-300'
                  }`}>
                  <Icon icon={item.icon} className="h-5 w-5" /> {item.label}
                </Link>
              ))}
            {isSettingsPage &&
              settingsSubmenuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2 py-3 rounded flex items-center gap-1 ${
                    location.pathname.includes(item.to)
                      ? 'bg-white border border-gray-300 text-indigo-600'
                      : 'text-gray-600 hover:bg-white hover:border hover:border-gray-300'
                  }`}>
                  <Icon icon={item.icon} className="h-5 w-5" /> {item.label}
                </Link>
              ))}
          </div>
        </div>
      )}

      <main className={`${padding} ${isInventoryPage ? 'flex-1 overflow-hidden' : ''}`}>{children}</main>
    </div>
  );
};

export default AdminLayout;
