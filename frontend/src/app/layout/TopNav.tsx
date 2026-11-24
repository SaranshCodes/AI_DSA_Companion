import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Puzzle,
  History,
  BarChart3,
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useActiveSessionStore } from '@/features/session/store/useActiveSessionStore';
import { APP_NAME, APP_SUBTITLE } from '@/lib/constants';

export const TopNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const session = useActiveSessionStore((s) => s.session);
  const hasActiveSession = Boolean(session && !session.outcome);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid },
    {
      to: '/session',
      label: 'Current Session',
      icon: Puzzle,
      hasDot: hasActiveSession,
    },
    { to: '/history', label: 'History', icon: History },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/revision', label: 'Revision', icon: RotateCcw },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text rounded p-1 -ml-1"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-inverse flex items-center justify-center text-on-inverse shadow-sm">
            <Puzzle className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold tracking-tight block leading-tight">
              {APP_NAME}
            </span>
            <span className="text-[11px] text-text-muted block leading-tight">
              {APP_SUBTITLE}
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all relative select-none ${
                    isActive
                      ? 'bg-surface-inverse text-on-inverse shadow-sm'
                      : 'text-text-muted hover:text-text hover:bg-bg-subtle'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.hasDot && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-amber-300' : 'bg-warning animate-pulse'
                        }`}
                        title="Active problem in progress"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Side: User Menu & Mobile Trigger */}
        <div className="flex items-center gap-2.5">
          <UserMenu />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-text rounded-control hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-control text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-inverse text-on-inverse'
                      : 'text-text-muted hover:text-text hover:bg-bg-subtle'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.hasDot && (
                  <span className="w-2 h-2 rounded-full bg-warning" />
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
