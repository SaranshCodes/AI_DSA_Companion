import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const UserMenu: React.FC = () => {
  const { email, logout } = useAuthStore();
  const initial = (email || 'U').charAt(0).toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-inverse text-on-inverse text-xs font-bold tracking-tight shadow-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2"
          aria-label="User account menu"
        >
          {initial}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[220px] rounded-control bg-surface p-1.5 shadow-lg border border-border text-sm text-text animate-in fade-in-50 zoom-in-95"
        >
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-sm font-medium text-text truncate mt-0.5">
              {email || 'Account'}
            </p>
          </div>

          <DropdownMenu.Item
            disabled
            className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted rounded cursor-default select-none opacity-60"
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-danger rounded cursor-pointer select-none hover:bg-danger-bg focus:bg-danger-bg focus:outline-none transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
