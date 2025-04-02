import { ContractDropdown } from '@/components/ContractDropdown';
import LangSelector from '@/components/LangSelector';
import ProfileDropdown from '@/components/ProfileDropdown';
import { WorkOrdersNavigation } from '@/components/Worker/WorkOrders';
import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import { Roles } from '@/types/Role';
import { matchPath } from '@/utils/navigation';
import { Icon } from '@iconify/react';
import logo from '@images/logo.png';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { format } = useI18n();
  const location = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Path checking utilities using the utility function
  const checkPath = (patterns: string[]) =>
    matchPath(patterns, location.pathname);

  // Path patterns
  const PATH_PATTERNS = {
    management: [
      '/admin/dashboard*',
      '/admin/eva*',
      '/admin/inventory*',
      '/admin/resources*',
      '/admin/statistics*',
      '/admin/work-orders*',
      '/admin/work-reports*',
      '/admin/workers*',
    ],
    settings: ['/admin/settings'],
    account: ['/account'],
  };

  // Efficient path checks
  const isManagementActive = checkPath(PATH_PATTERNS.management);
  const isSettingsPage = checkPath(PATH_PATTERNS.settings);
  const isAccountPage = checkPath(PATH_PATTERNS.account);

  // Show contract dropdown for admin in management section, workers, and customers (but disabled for customers)
  const showContractDropdown =
    isManagementActive ||
    user?.role === Roles.worker ||
    user?.role === Roles.customer;

  // Only disable for customers
  const disableContractDropdown = user?.role === Roles.customer;

  const padding = location.pathname.includes('/admin/inventory')
    ? 'py-8 px-4'
    : 'max-w-7xl mx-auto pt-8 pb-16 px-8';

  // Navigation items structure with role requirements
  const navItems = {
    main: [
      {
        to: '/admin',
        label: format('glossary:management'),
        icon: 'tabler:briefcase',
        active: isManagementActive,
        roles: [Roles.admin],
        submenu: [
          {
            to: '/admin/dashboard',
            label: format('glossary:dashboard'),
            icon: 'tabler:layout-dashboard',
          },
          {
            to: '/admin/inventory',
            label: format('glossary:inventory'),
            icon: 'tabler:chart-treemap',
          },
          {
            to: '/admin/evas',
            label: format({
              key: 'glossary:eva',
              formatOptions: ['uppercase'],
            }),
            icon: 'tabler:chart-bar',
          },
          {
            to: '/admin/work-orders',
            label: format({
              key: 'work_order',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:clipboard-text',
          },
          {
            to: '/admin/workers',
            label: format({
              key: 'worker',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:users',
          },
          {
            to: '/admin/resources',
            label: format({
              key: 'resource',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:package',
          },
          {
            to: '/admin/statistics',
            label: format({
              key: 'statistics',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:chart-pie-4',
          },
        ],
      },
      {
        to: '/admin/settings',
        label: format('glossary:settings'),
        icon: 'tabler:settings',
        active: isSettingsPage,
        roles: [Roles.admin],
        submenu: [
          {
            to: '/admin/settings/contracts',
            label: format({
              key: 'contract',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:file-description',
          },
          {
            to: '/admin/settings/element-types',
            label: format({
              key: 'element_type',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:box',
          },
          {
            to: '/admin/settings/tree-types',
            label: format({
              key: 'specie',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:tree',
          },
          {
            to: '/admin/settings/task-types',
            label: format({
              key: 'task_type',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:list-check',
          },
          {
            to: '/admin/settings/resource-types',
            label: format({
              key: 'resource_type',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:package-export',
          },
          {
            to: '/admin/settings/users',
            label: format({
              key: 'user',
              formatOptions: ['capitalize', 'interval'],
            }),
            icon: 'tabler:users',
          },
        ],
      },
      {
        to: '/app',
        label: format('glossary:map'),
        icon: 'tabler:map',
        active: location.pathname === '/app',
        roles: [Roles.worker],
      },
      {
        to: '/app/work-orders',
        label: format({
          key: 'work_order',
          formatOptions: ['capitalize', 'interval'],
        }),
        icon: 'tabler:clipboard-text',
        active: location.pathname.startsWith('/app/work-orders'),
        roles: [Roles.worker],
        submenu: [
          {
            type: 'dateNavigationWithCalendar',
          },
        ],
      },
    ],
  };

  // Helper function to check if user has required role for a menu item
  const hasRequiredRole = (requiredRoles: (Roles | undefined)[]) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user?.role);
  };

  // Helper function to render navigation links with role check
  const renderNavLinks = (items: any[], isMobile = false, isSubmenu = false) =>
    items
      .filter((item) => hasRequiredRole(item.roles))
      .map((item) => {
        // For submenu items, determine if they're active when on a subpage
        const isActive = isSubmenu
          ? location.pathname.startsWith(item.to)
          : item.active;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`${isSubmenu ? 'px-2 py-3' : isMobile ? 'py-2' : 'px-2 py-2'}
              rounded flex items-center gap-${isSubmenu ? '1' : '2'}
              ${
                isSubmenu
                  ? isActive
                    ? 'bg-gray-100 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                  : isMobile
                    ? item.active
                      ? 'bg-gray-200 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                    : item.active
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
              }`}>
            <Icon
              width={isSubmenu ? '22px' : '24px'}
              icon={item.icon}
              inline={!isMobile && !isSubmenu}
            />
            {item.label}
          </Link>
        );
      });

  // Get active submenu items based on current navigation
  const getActiveSubmenuItems = () => {
    const activeMainItem = navItems.main.find((item) => item.active);
    return activeMainItem?.submenu || [];
  };

  // Modified submenu rendering to handle custom elements
  const renderSubmenu = () => {
    const submenuItems = getActiveSubmenuItems();

    if (submenuItems.length === 0) return null;

    return (
      <div className="submenu text-center flex items-center justify-center gap-4 mx-auto max-w-7xl w-full">
        {submenuItems.map((item: any) => {
          if (item.type === 'dateNavigationWithCalendar') {
            return <WorkOrdersNavigation key="work-orders-navigation" />;
          } else {
            return renderNavLinks([item], false, true);
          }
        })}
      </div>
    );
  };

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
            {renderNavLinks(navItems.main)}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex gap-4">
              {showContractDropdown && (
                <ContractDropdown disabled={disableContractDropdown} />
              )}
              <LangSelector />
            </div>

            <ProfileDropdown />
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`${menuOpen ? '' : 'hidden'} lg:hidden px-8 py-6 bg-gray-100`}>
          {renderNavLinks(navItems.main, true)}
          <div className="mt-4 flex flex-col gap-4">
            {showContractDropdown && (
              <ContractDropdown
                className="w-full"
                disabled={disableContractDropdown}
              />
            )}
            <LangSelector className="w-full" />
          </div>
        </div>
      </header>

      {/* Submenu navigation - modified to use renderSubmenu */}
      {!isAccountPage && getActiveSubmenuItems().length > 0 && (
        <div className="flex justify-center overflow-x-auto flex-nowrap whitespace-nowrap items-center gap-4 px-8 py-4 bg-gray-50 shadow-md">
          {renderSubmenu()}
        </div>
      )}

      <main className={padding}>{children}</main>
    </div>
  );
};

export default AppLayout;
