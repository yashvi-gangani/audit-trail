import React from 'react';
import { Database, Home, Activity, Package, BarChart2 } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Audit Dashboard', icon: Activity },
    { id: 'catalog', label: 'Shipment Catalog', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <header style={{ 
      background: 'var(--bg-secondary)', 
      borderBottom: '1px solid var(--border-color)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100 
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0.75rem 1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div style={{ 
            background: 'var(--primary-glow)', 
            border: '1px solid var(--primary)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '0.4rem', 
            display: 'flex' 
          }}>
            <Database size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              AuditTrail
            </span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-secondary)' }}>
              CQRS & Event Sourcing
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
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
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={15} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--success)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></span>
          System Live
        </div>
      </div>
    </header>
  );
}
