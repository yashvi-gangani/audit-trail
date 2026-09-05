import React, { useState, useEffect } from 'react';
import { Truck, Home, Activity, Package, BarChart2 } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Audit Dashboard', icon: Activity },
    { id: 'catalog', label: 'Shipment Catalog', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <div 
      style={{
        position: 'sticky',
        top: '0.75rem',
        zIndex: 1000,
        padding: '0 1rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {/* Floating Glassmorphic Pill Header */}
      <header
        style={{
          width: '100%',
          maxWidth: '1240px',
          background: scrolled 
            ? 'rgba(13, 17, 23, 0.85)' 
            : 'rgba(17, 24, 39, 0.65)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          padding: '0.5rem 1.25rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.65rem', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Truck size={18} style={{ color: '#ffffff' }} />
          </div>
          <span style={{ 
            fontSize: '1.15rem', 
            fontWeight: '800', 
            letterSpacing: '-0.03em', 
            color: '#ffffff'
          }}>
            AuditTrail
          </span>
        </div>

        {/* Existing Application Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                  color: isActive ? '#ffffff' : 'rgba(240, 243, 249, 0.75)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} style={{ color: isActive ? '#818cf8' : 'rgba(240, 243, 249, 0.5)' }} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>
    </div>
  );
}
