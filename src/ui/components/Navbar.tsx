import React, { useState } from 'react';
import { Heart, Bell, Shield, Home, ShoppingBag, Users, Sparkles, Award, Menu, X, ArrowRight } from 'lucide-react';
import type { User } from '../../domain/types';

interface NavbarProps {
  currentUser: User;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenRoleSwitcher: () => void;
  activeOrderCount: number;
  upcomingRemindersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onNavigate,
  onOpenRoleSwitcher,
  activeOrderCount,
  upcomingRemindersCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'shelters', label: 'Shelters', icon: Home },
    { id: 'gifts', label: 'Send Gifts', icon: ShoppingBag },
    { id: 'batches', label: 'Batches', icon: Heart },
    { id: 'name-a-dog', label: 'Name a Dog', icon: Sparkles },
    { id: 'membership', label: 'Membership', icon: Award },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: upcomingRemindersCount },
    { id: 'impact', label: 'My Impact', icon: Award },
    { id: 'reviews', label: 'Service Reviews', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FFF8F6]/95 backdrop-blur-md border-b border-[#F4A8C3]/40 shadow-paw-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => {
              onNavigate('shelters');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3.5 text-left group focus-visible:outline-2 focus-visible:outline-[#B0285F] rounded-2xl p-1"
            aria-label="Pawfect Home"
          >
            <img
              src="/assets/aistudio/pawfect-logo-brown-beige_f8c728e7.png"
              alt="Pawfect Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="block text-2xl font-bold text-[#7E1B43] tracking-tight font-heading leading-tight">
                Pawfect
              </span>
              <span className="block text-[11px] font-medium text-[#8A6B79] leading-none tracking-wide">
                Connecting every paw to its perfect hands
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                      : 'text-[#3A2530] hover:bg-[#FDEBF0] hover:text-[#7E1B43]'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#FFF8F6]' : 'text-[#8A6B79]'} />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#E27AA1] text-[#FFF8F6] text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active order tracker pill */}
            {activeOrderCount > 0 && (
              <button
                onClick={() => onNavigate('impact')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FDEBF0] text-[#7E1B43] border border-[#F4A8C3] rounded-full text-xs font-bold hover:bg-[#F4A8C3]/40 transition-colors"
                title="View active gift status"
              >
                <span className="w-2 h-2 rounded-full bg-[#B0285F] animate-ping" />
                <span>{activeOrderCount} In Progress</span>
              </button>
            )}

            {/* Role switch / login button */}
            <button
              onClick={onOpenRoleSwitcher}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F6] border border-[#E27AA1] rounded-full text-xs font-semibold text-[#7E1B43] hover:bg-[#FDEBF0] transition-colors shadow-paw-sm"
              aria-label={`Current persona: ${currentUser.role}. Click to switch view.`}
            >
              <Shield size={13} className="text-[#B0285F]" />
              <span className="capitalize">{currentUser.role === 'shelter_rep' ? 'Shelter Portal' : currentUser.role}</span>
              {currentUser.adminRole && (
                <span className="hidden md:inline text-[10px] bg-[#B0285F] text-[#FFF8F6] px-1 rounded">
                  {currentUser.adminRole}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#3A2530] hover:bg-[#FDEBF0] focus-visible:outline-2"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F4A8C3]/50 bg-[#FFF8F6] px-4 pt-3 pb-6 shadow-paw-md animate-fadeIn">
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#B0285F] text-[#FFF8F6]'
                      : 'text-[#3A2530] hover:bg-[#FDEBF0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 bg-[#E27AA1] text-[#FFF8F6] text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  ) : (
                    <ArrowRight size={14} className="opacity-40" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-[#F4A8C3]/40 flex items-center justify-between text-xs text-[#8A6B79]">
            <span>Signed in as <strong className="text-[#3A2530]">{currentUser.name}</strong></span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRoleSwitcher();
              }}
              className="text-[#B0285F] font-bold underline"
            >
              Switch Role
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
