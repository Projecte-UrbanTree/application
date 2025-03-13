import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import { Avatar } from 'primereact/avatar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import logo from '@images/logo.png';
import LangSelector from '@/components/LangSelector';
import { useI18n } from '@/hooks/useI18n';
import { useDispatch, useSelector } from 'react-redux';
import { selectContract, setContractState } from '@/store/slice/contractSlice';
import { Contract, ContractProps } from '@/types/contract';
import { defaultContract } from '@/components/Admin/Dashboard/AdminDashboardWrapper';

interface AdminLayoutProps {
    titleI18n: string;
    children: React.ReactNode;
    contracts: Contract[];
    currentContract?: Contract;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    titleI18n,
    children,
    contracts,
    currentContract,
}) => {
    const { t } = useI18n();
    const { user, logout } = useAuth();
    const location = useLocation();
    const dispatch = useDispatch();
    const profileRef = useRef<HTMLDivElement>(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

    const [contract, setContract] = useState<Contract>(
        currentContract ?? defaultContract,
    );

    useEffect(() => {
        if (currentContract) {
            setContract(currentContract);
        }
    }, [currentContract]);

    const handleContractChange = useCallback(
        (e: DropdownChangeEvent) => {
            const selectedContract = contracts.find((c) => c.id === e.value);

            if (selectedContract) {
                dispatch(selectContract(selectedContract.id!));
                setContract(selectedContract);
            }
        },
        [dispatch, contracts],
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

    const isManagementActive = [
        '/admin/dashboard',
        '/admin/work-orders',
        '/admin/inventory',
        '/admin/workers',
        '/admin/resources',
        '/admin/statistics',
    ].some((path) => location.pathname.startsWith(path));

    const isSettingsPage = location.pathname.includes('/admin/settings');

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
            to: '/admin/eva',
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
                                <Icon
                                    width="24px"
                                    icon="tabler:menu"
                                    color="#ffffff"
                                />
                            </Button>
                        </div>
                        <a href="/" className="flex-none">
                            <img className="w-48" src={logo} alt="Logo" />
                        </a>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-center items-center space-x-6">
                        <Link
                            to="/admin/dashboard"
                            className={`text-gray-700 px-2 py-2 rounded flex items-center gap-2 ${
                                isManagementActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'hover:bg-gray-100'
                            }`}>
                            <Icon
                                inline={true}
                                width="24px"
                                icon="tabler:briefcase"
                            />{' '}
                            {t('admin.menu.management')}
                        </Link>
                        <Link
                            to="/admin/settings/contracts"
                            className={`text-gray-700 px-2 py-2 rounded flex items-center gap-2 ${
                                location.pathname.includes('/admin/settings')
                                    ? 'bg-indigo-600 text-white'
                                    : 'hover:bg-gray-100'
                            }`}>
                            <Icon
                                inline={true}
                                width="24px"
                                icon="tabler:settings"
                            />{' '}
                            {t('admin.menu.settings')}
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex gap-4">
                            {!isSettingsPage && (
                                <Dropdown
                                    id="contractBtn"
                                    name="contractBtn"
                                    className="w-32"
                                    value={contract.id ?? 0}
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
                                label={
                                    (user?.name?.[0] ?? '') +
                                    (user?.surname?.[0] ?? '')
                                }
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
                                        href="/admin/account"
                                        className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                                        {t(
                                            'admin.profileDropdown.accountSettings',
                                        )}
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
                        {!isSettingsPage && (
                            <Dropdown
                                id="contractBtn"
                                name="contractBtn"
                                className="w-full"
                                value={contract.id}
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
                                <Icon width="22px" icon={item.icon} />{' '}
                                {item.label}
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
                                <Icon width="22px" icon={item.icon} />{' '}
                                {item.label}
                            </Link>
                        ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto pt-8 pb-16 px-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
