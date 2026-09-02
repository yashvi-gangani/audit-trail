import React from 'react';
import { BarChart2, ShieldCheck, Thermometer, AlertTriangle, Layers, Activity, CheckCircle, Database } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '700' }}>System Audit Analytics & Telemetry Reports</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-time telemetry performance metrics and CQRS event stream throughput</p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Events Appended</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>14,290</span>
            <Layers size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.3rem', display: 'block' }}>+12.4% vs last week</span>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Cryptographic Integrity Rate</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>100.0%</span>
            <ShieldCheck size={24} style={{ color: 'var(--success)' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>0 Hashes Corrupted</span>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--info)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Active Cold Chains</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>482</span>
            <Thermometer size={24} style={{ color: 'var(--info)' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>Sensor Refresh: 10 sec</span>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--warning)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Thermal Excursions</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>2</span>
            <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.3rem', display: 'block' }}>0.01% Excursion Rate</span>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Event Distribution Bar chart simulation */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--primary)' }} /> Event Type Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>RECORD_TEMPERATURE</span>
                <span style={{ fontWeight: 'bold' }}>48% (6,859 events)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: '48%', height: '100%', background: 'var(--info)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>UPDATE_LOCATION</span>
                <span style={{ fontWeight: 'bold' }}>26% (3,715 events)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: '26%', height: '100%', background: 'var(--primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>SHIPMENT_CREATED</span>
                <span style={{ fontWeight: 'bold' }}>14% (2,000 events)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: '14%', height: '100%', background: 'var(--success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>TRANSFER_SHIPMENT</span>
                <span style={{ fontWeight: 'bold' }}>8% (1,143 events)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', background: 'var(--warning)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>CHANGE_STATUS</span>
                <span style={{ fontWeight: 'bold' }}>4% (573 events)</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: '4%', height: '100%', background: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Verification Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--success)' }} /> Regulatory Compliance Verification
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>GDP (Good Distribution Practice) Compliant</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Full historical temperature logs preserved for medicinal cargo.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>21 CFR Part 11 Audit Trail Ready</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Time-stamped electronic signatures attached to every custody transfer block.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Zero Mutated Records</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>MongoDB pre-update immutability hooks active.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
