import { ContractDropdown } from '@/components/ContractDropdown';
import LangSelector from '@/components/LangSelector';
import useAuth from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { AppDispatch, type RootState } from '@/redux/store';
import { Icon } from '@iconify/react';
import logo from '@images/logo.png';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedContract = useSelector(
    (state: RootState) => state.auth.user?.selected_contract_id,
  );
  const [key, setKey] = useState(0);
  const { t, i18n } = useI18n();
  const location = useLocation();
  const padding = location.pathname.includes('/admin/inventory')
    ? 'py-8 px-4'
    : 'max-w-7xl mx-auto pt-8 pb-16 px-8';
  const { user, handleLogout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  const handleProfileClick = () => setProfileDropdownVisible((prev) => !prev);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1); // 🔄 Canvia la `key` per forçar la re-renderització
  }, [selectedContract]);

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

  const isManagementActive = [
    '/admin/dashboard',
    '/admin/work-orders',
    '/admin/inventory',
    '/admin/eva',
    '/admin/workers',
    '/admin/resources',
    '/admin/statistics',
  ].some((path) => location.pathname.startsWith(path));

  const isSettingsPage = location.pathname.includes('/admin/settings');
  const isWorkOrderEditPage = location.pathname.includes(
    '/admin/work-orders/edit/',
  );
  const isResourceEditPage = location.pathname.includes(
    '/admin/resources/edit/',
  );
  const isAccountPage = location.pathname.includes('/me');

  const hideContractSelector =
    isSettingsPage ||
    isWorkOrderEditPage ||
    isResourceEditPage ||
    isAccountPage;

  const managementSubmenuItems = [
    {
      to: '/admin/dashboard',
      label: t('_capitalize', { val: t('glossary:dashboard') }),
      icon: 'tabler:layout-dashboard',
    },
    {
      to: '/admin/inventory',
      label: t('_capitalize', { val: t('glossary:inventory') }),
      icon: 'tabler:chart-treemap',
    },
    {
      to: '/admin/evas',
      label: t('_uppercase', { val: t('glossary:eva') }),
      icon: 'tabler:chart-bar',
    },
    {
      to: '/admin/work-orders',
      label: t('_capitalize', {
        val: t('glossary:work_order_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:clipboard-text',
    },
    {
      to: '/admin/workers',
      label: t('_capitalize', {
        val: t('glossary:workers_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:users',
    },
    {
      to: '/admin/resources',
      label: t('_capitalize', {
        val: t('glossary:resources_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:package',
    },
    {
      to: '/admin/statistics',
      label: t('_capitalize', {
        val: t('glossary:statistics_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:chart-pie-4',
    },
  ];
  const settingsSubmenuItems = [
    {
      to: '/admin/settings/contracts',
      label: t('_capitalize', {
        val: t('glossary:contract_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:file-description',
    },
    {
      to: '/admin/settings/element-types',
      label: t('_capitalize', {
        val: t('glossary:element_type_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:box',
    },
    {
      to: '/admin/settings/tree-types',
      label: t('_capitalize', {
        val: t('glossary:specie_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:tree',
    },
    {
      to: '/admin/settings/task-types',
      label: t('_capitalize', {
        val: t('glossary:task_type_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:list-check',
    },
    {
      to: '/admin/settings/resource-types',
      label: t('_capitalize', {
        val: t('glossary:resource_type_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:package-export',
    },
    {
      to: '/admin/settings/users',
      label: t('_capitalize', {
        val: t('glossary:user_interval', { postProcess: 'interval' }),
      }),
      icon: 'tabler:users',
    },
  ];

  const mobileNavItems = [
    {
      to: '/admin',
      label: t('_capitalize', { val: t('glossary:management') }),
      icon: 'tabler:briefcase',
      active: isManagementActive,
    },
    {
      to: '/admin/settings',
      label: t('_capitalize', { val: t('glossary:settings') }),
      icon: 'tabler:settings',
      active: location.pathname.includes('/admin/settings'),
    },
  ];

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
            <Link
              to="/admin"
              className={`text-gray-700 px-2 py-2 rounded flex items-center gap-2 ${
                isManagementActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100'
              }`}>
              <Icon inline={true} width="24px" icon="tabler:briefcase" />{' '}
              {t('_capitalize', { val: t('glossary:management') })}
            </Link>
            <Link
              to="/admin/settings"
              className={`text-gray-700 px-2 py-2 rounded flex items-center gap-2 ${
                location.pathname.includes('/admin/settings')
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100'
              }`}>
              <Icon inline={true} width="24px" icon="tabler:settings" />{' '}
              {t('_capitalize', { val: t('glossary:settings') })}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex gap-4">
              {!hideContractSelector && <ContractDropdown />}
              <LangSelector />
            </div>

            <div className="relative">
              <Avatar
                onClick={handleProfileClick}
                label={(user?.name?.[0] ?? '') + (user?.surname?.[0] ?? '')}
                size="large"
                shape="circle"
                className="cursor-pointer"
                style={{
                  color: '#fff',
                  backgroundColor: '#8ccc63',
                }}
              />
              {profileDropdownVisible && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md ring-1 ring-black/5 z-10"
                  ref={profileRef}>
                  <a
                    href="/me"
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('admin:profileDropdown.accountSettings')}
                  </a>
                  <a
                    href="/license"
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('_capitalize', { val: t('glossary:license') })}
                  </a>
                  <a
                    onClick={() => handleLogout()}
                    className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    {t('_capitalize', { val: t('actions.logout') })}
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
        <div
          className={`${menuOpen ? '' : 'hidden'} lg:hidden px-8 py-6 bg-gray-100`}>
          {mobileNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`py-2 text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 ${
                item.active ? 'bg-gray-200 text-indigo-600' : ''
              }`}>
              <Icon width="24px" icon={item.icon} /> {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-4">
            {!hideContractSelector && <ContractDropdown className="w-full" />}
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
                  className={`px-2 py-3 rounded flex items-center gap-1 ${
                    location.pathname === item.to
                      ? 'bg-gray-100 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                  <Icon width="22px" icon={item.icon} /> {item.label}
                </Link>
              ))}
            {location.pathname.includes('/admin/settings') &&
              settingsSubmenuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2 py-3 rounded flex items-center gap-1 ${
                    location.pathname === item.to
                      ? 'bg-gray-100 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                  <Icon width="22px" icon={item.icon} /> {item.label}
                </Link>
              ))}
          </div>
        </div>
      )}

      <main key={key} className={padding}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
