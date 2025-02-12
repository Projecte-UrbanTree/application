import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

import { Avatar } from 'primereact/avatar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { Icon } from '@iconify/react';

import logo from '@images/logo.png';
import LangSelector from '@/components/LangSelector';
import { useI18n } from '@/hooks/useI18n';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  contracts: { id: string; name: string }[];
  currentContract: string;
  successMessage?: string;
  errorMessage?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  children,
  contracts,
  currentContract,
  successMessage,
  errorMessage,
}) => {
  document.title = title
    ? `${title} - ${import.meta.env.VITE_APP_NAME}`
    : import.meta.env.VITE_APP_NAME;

  const [menuOpen, setMenuOpen] = useState(false);
  const [contract, setContract] = useState(currentContract);
  const { user, logout } = useAuth();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const toastRef = React.useRef<Toast>(null);
  const { t } = useI18n();

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
          <a href="#" className="hidden sm:block">
            <img className="w-36 md:w-50" src={logo} alt="Logo" />
          </a>

          <div className="block md:hidden">
            <Button icon="pi pi-bars" onClick={() => setMenuOpen(!menuOpen)} />
          </div>

          <div className="hidden md:flex space-x-6">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-2">
              <Icon inline={true} width="24px" icon="tabler:adjustments-cog" />{' '}
              {t('admin.menu.management')}
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-2">
              <Icon width="24px" icon="tabler:map-cog" />{' '}
              {t('admin.menu.inventory')}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown
              id="contractBtn"
              name="contractBtn"
              className="w-48"
              value={contract}
              options={contracts}
              onChange={handleContractChange}
              optionLabel="name"
              optionValue="id">
              <option value="-1">Todos los contratos</option>
            </Dropdown>
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
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm">
                    {t('admin.profileDropdown.accountSettings')}
                  </a>
                  <a
                    href="/license"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm">
                    {t('admin.profileDropdown.license')}
                  </a>
                  <a
                    onClick={logout}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm">
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
            <Icon width="24px" icon="mdi-light:home" /> Gestión
          </a>
          <a
            href="/admin/inventory"
            className="block py-2 text-gray-700 hover:bg-gray-200 rounded flex items-center gap-2">
            <Icon width="24px" icon="mdi-light:home" /> Inventario
          </a>
        </div>
      </header>

      <div
        id="submenu"
        className="md:flex overflow-x-auto flex-nowrap whitespace-nowrap items-center gap-4 px-4 py-4 bg-gray-100 shadow-md">
        <div className="submenu text-center flex items-center space-x-6 mx-auto">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.contracts')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.workOrders')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.elementTypes')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.species')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.taskTypes')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.resources')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.resourceTypes')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.users')}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-600 active:text-gray-700 flex items-center gap-1 text-sm">
            <Icon width="22px" icon="tabler:question-mark" />{' '}
            {t('admin.submenu.stats')}
          </a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-16">{children}</main>
    </div>
  );
};

export default AdminLayout;
