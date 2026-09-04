import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Thermometer, History, ArrowRight, CheckCircle2, Lock, Database } from 'lucide-react';

const featureData = [
  {
    icon: Lock,
    title: "Append-Only Event Store",
    desc: "Every action is saved as a discrete event document. Database middleware enforces strict immutability, preventing updates or deletions of historical records.",
    color: "#2563eb"
  },
  {
    icon: Cpu,
    title: "CQRS Pattern Segregation",
    desc: "Write operations (Commands) and Read operations (Queries) are split into dedicated channels, allowing ultra-fast read models without locking event logs.",
    color: "#7c3aed"
  },
  {
    icon: Thermometer,
    title: "Thermal Telemetry Tracking",
    desc: "Monitors cold-chain storage parameters with real-time temperature graph telemetry, flagging safety threshold excursions automatically.",
    color: "#059669"
  },
  {
    icon: History,
    title: "State Replay Scrubber",
    desc: "Interactive time-travel controller allows auditors to scrub through event streams block-by-block and reconstruct the shipment state at any point in history.",
    color: "#d97706"
  }
];

function RotatingFeatureCards() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featureData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="feature-cards-grid">
      {featureData.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = activeIndex === index;
        return (
          <div
            key={index}
            className={`feature-card ${isActive ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <div className="feature-card-indicator" />
            <div
              className="feature-icon-wrapper"
              style={{
                borderColor: isActive ? item.color : '#e2e8f0',
                color: isActive ? item.color : '#475569',
                background: isActive ? `${item.color}18` : '#f8fafc'
              }}
            >
              <IconComponent size={22} style={{ color: isActive ? item.color : '#475569' }} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export function LandingPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.35rem 0.85rem', 
          background: 'var(--primary-glow)', 
          border: '1px solid var(--primary)', 
          borderRadius: '9999px', 
          fontSize: '0.8rem', 
          color: 'var(--primary)', 
          fontWeight: '600' 
        }}>
          <Shield size={14} /> Enterprise Audit Ledger Standard
        </div>

        <h1 style={{ 
          fontSize: '2.8rem', 
          fontWeight: '800', 
          lineHeight: '1.2', 
          maxWidth: '850px', 
          letterSpacing: '-0.03em',
          background: 'linear-gradient(to right, #242020, #9aa4b7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Immutable Supply Chain Auditability Powered by Event Sourcing & CQRS
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: '1.6' }}>
          Track every shipment state transition, thermal excursion alert, and custody handover with cryptographic append-only integrity.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              background: 'var(--primary)',
              color: '#000000',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 20px var(--primary-glow)',
              transition: 'all var(--transition-fast)'
            }}
          >
            Launch Audit Dashboard <ArrowRight size={18} />
          </button>

          <button 
            onClick={() => onNavigate('catalog')}
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            View Shipment Catalog
          </button>
          
        </div>
      </section>

      {/* Metrics Counter */}
      <section className="card" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2rem', 
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}>
        <div>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: '700' }}>100%</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Immutable Append-Only Log</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2rem', color: 'var(--success)', fontWeight: '700' }}>&lt; 1ms</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>CQRS Projection Latency</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2rem', color: 'var(--info)', fontWeight: '700' }}>24/7</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>IoT Cold-Chain Telemetry</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2rem', color: 'var(--warning)', fontWeight: '700' }}>Zero</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Data Tampering Risk</p>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Core Architectural Capabilities</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            Designed to meet strict regulatory and compliance audit standards
          </p>
        </div>

        <RotatingFeatureCards />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        AuditTrail Supply Chain Platform • Built for Axlero innovative solutions • 2026
      </footer>
    </div>
  );
}
