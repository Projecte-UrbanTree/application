import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import { Roles } from '@/types/Role';
import { Avatar } from 'primereact/avatar';
import React, { useEffect, useRef, useState } from 'react';

const ProfileDropdown: React.FC = () => {
  const { t, format } = useI18n();
  const { user, handleLogout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  // Handle clicks outside profile dropdown
  useEffect(() => {
    if (!profileDropdownVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownVisible]);

  // Profile dropdown items
  const profileItems = [
    // Only show account settings for admin users
    ...(user?.role === Roles.admin
      ? [
          {
            href: '/account',
            label: t('admin:profileDropdown.accountSettings'),
          },
        ]
      : []),
    { href: '/license', label: format('glossary:license') },
    { onClick: handleLogout, label: format('actions.logout') },
  ];

  return (
    <div className="relative">
      <Avatar
        onClick={() => setProfileDropdownVisible((prev) => !prev)}
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
          {profileItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={item.onClick}
              className="block px-4 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
