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

interface WorkerLayoutProps {
  titleI18n: string;
  children: React.ReactNode;
}

const WorkerLayout: React.FC<WorkerLayoutProps> = ({ children, titleI18n }) => {
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

  const isWorkOrdersPage = location.pathname === '/worker';
  const isInventoryPage = location.pathname.includes('/worker/inventory');
  const activeContracts = allContracts.filter(
    (contract) => contract.status === 0,
  );
  const contracts =
    isInventoryPage || isWorkOrdersPage
      ? activeContracts
      : [defaultContract, ...activeContracts];

  const isAccountPage = location.pathname.includes('/admin/account');

  const hideContractSelector = isAccountPage;

  useEffect(() => {
    dispatch(fetchAllContracts());
  }, [dispatch]);

  useEffect(() => {
    document.title = `${t(titleI18n)} - ${import.meta.env.VITE_APP_NAME}`;
  }, [titleI18n, t]);

  useEffect(() => {
    if (
      (isInventoryPage || isWorkOrdersPage) &&
      activeContracts.length > 0 &&
      !initialized
    ) {
      const savedContractId = localStorage.getItem(SELECTED_CONTRACT_KEY);

      if (savedContractId) {
        const contractId = parseInt(savedContractId);
        const contractExists = activeContracts.some((c) => c.id === contractId);

        if (contractExists) {
          dispatch(selectContract(contractId));
          setInitialized(true);
          return;
        }
      }

      if (
        !currentContract ||
        !activeContracts.some((c) => c.id === currentContract.id)
      ) {
        dispatch(selectContract(activeContracts[0]?.id ?? 0));
      }

      setInitialized(true);
    }
  }, [isInventoryPage, isWorkOrdersPage, activeContracts.length, initialized]);

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
      to: '/worker',
      label: 'Ordenes de Trabajo',
      icon: 'tabler:briefcase',
      active: isWorkOrdersPage,
    },
    {
      to: '/worker/inventory',
      label: 'Inventario',
      icon: 'tabler:settings',
      active: false,
    },
  ];

  const padding = isInventoryPage
    ? 'py-8 px-4'
    : 'max-w-7xl mx-auto pt-8 pb-16 px-8';

  return (
    <div>
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

      <main className={padding}>{children}</main>
    </div>
  );
};

export default WorkerLayout;
