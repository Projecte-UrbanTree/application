import { useI18n } from '@/hooks/useI18n';
import { useAuth } from '@/hooks/useAuth';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Icon } from '@iconify/react';
import LangSelector from '@/components/LangSelector';
import { selectContract, fetchAllContracts } from '@/store/slice/contractSlice';
import { Contract } from '@/types/Contract';
import logo from '@images/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

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
  const { user, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<number | null>(null);

  const { allContracts, currentContract } = useSelector(
    (state: RootState) => state.contract,
  );

  const isInventoryPage = location.pathname.includes('/admin/inventory');
  const isWorkersPage = location.pathname.includes('/admin/workers');
  const contracts =
    isInventoryPage || isWorkersPage
      ? allContracts
      : [defaultContract, ...allContracts];

  const isManagementActive = [
    '/admin/dashboard',
    '/admin/work-orders',
    '/admin/inventory',
    '/admin/eva',
    '/admin/workers',
    '/admin/resources',
    '/admin/statistics',
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
    document.title = t(titleI18n);
  }, [titleI18n, t]);

  useEffect(() => {
    if (dropdownValue === null) {
      setDropdownValue(currentContract ? currentContract.id : 0);
    }
  }, [currentContract, dropdownValue]);

  const handleContractChange = useCallback(
    (e: DropdownChangeEvent) => {
      const newContractId = e.value;
      dispatch(selectContract(newContractId));
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
      to: '/admin/inventory',
      label: t('admin.submenu.manage.inventory'),
      icon: 'tabler:chart-treemap',
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
    ? 'py-8 px-4'
    : 'max-w-7xl mx-auto pt-8 pb-16 px-8';

  return (
    <div>
      <header className="border-b border-gray-200 bg-white shadow-md">
        <nav className="flex items-center justify-between px-8 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="block lg:hidden">
              <Button
                onClick={() => setMenuOpen(!menuOpen)}
                color="text-gray-800">
                <Icon width="24px" icon="tabler:menu" color="#ffffff" />
              </Button>
            </div>
            <a href="/" className="flex-none">
              <img className="w-48" src={logo} alt="Logo" />
            </a>
          </div>
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-6">
            {mobileNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-gray-700 px-2 py-2 rounded flex items-center gap-2 ${item.active ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}>
                <Icon inline={true} width="24px" icon={item.icon} />{' '}
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex gap-4">
              {!hideContractSelector && (
                <Dropdown
                  id="contractBtn"
                  className="w-40"
                  value={dropdownValue}
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
                style={{ color: '#fff', backgroundColor: '#8ccc63' }}
              />
              {profileDropdownVisible && (
                <div
                  ref={profileRef}
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md ring-1 ring-black/5 z-10">
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
                    onClick={() => logout()}
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin.profileDropdown.logout')}
                  </a>
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
                className="w-full"
                value={dropdownValue}
                options={contracts}
                onChange={handleContractChange}
                optionLabel="name"
                optionValue="id"
                placeholder={t('general.selectContract')}
              />
            )}
            <LangSelector className="w-full" />
          </div>
        </div>
      </header>

      {!isAccountPage && (
        <div
          id="submenu"
          className="lg:flex overflow-x-auto flex-nowrap whitespace-nowrap items-center gap-4 px-8 py-4 bg-gray-50 shadow-md">
          <div className="submenu text-center flex items-center gap-4 mx-auto max-w-7xl">
            {isManagementActive &&
              managementSubmenuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2 py-3 rounded flex items-center gap-1 ${location.pathname === item.to ? 'bg-gray-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <Icon width="22px" icon={item.icon} /> {item.label}
                </Link>
              ))}
            {isSettingsPage &&
              settingsSubmenuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2 py-3 rounded flex items-center gap-1 ${location.pathname === item.to ? 'bg-gray-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <Icon width="22px" icon={item.icon} /> {item.label}
                </Link>
              ))}
          </div>
        </div>
      )}

      <main className={padding}>{children}</main>
    </div>
  );
};

export default AdminLayout;
