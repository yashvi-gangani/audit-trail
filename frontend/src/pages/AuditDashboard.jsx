import React, { useState } from 'react';
import { Database, Search, MapPin, Thermometer, ShieldCheck, Clock, User, Box } from 'lucide-react';

// Basic Mock Shipment Ledger Data
const MOCK_SHIPMENT = {
  id: "SH-2026-9041",
  name: "BioCargo ColdChain (Insulins)",
  origin: "Berlin Hub",
  destination: "Liege Medical Center",
  containerId: "C-9812",
  events: [
    { index: 1, type: "SHIPMENT_CREATED", timestamp: "2026-08-15T08:00:00Z", location: "Berlin Hub", temp: 4.2, status: "Pending", actor: "Alice Vance" },
    { index: 2, type: "LOAD_CONTAINER", timestamp: "2026-08-15T09:30:00Z", location: "Berlin Hub", temp: 4.1, status: "Active", actor: "Bob Miller" },
    { index: 3, type: "UPDATE_LOCATION", timestamp: "2026-08-15T12:00:00Z", location: "A2 Autobahn", temp: 4.5, status: "In Transit", actor: "GPS Tracker" },
    { index: 4, type: "RECORD_TEMPERATURE", timestamp: "2026-08-15T15:00:00Z", location: "Bielefeld", temp: 5.2, status: "In Transit", actor: "IoT Sensor TS-8812" },
    { index: 5, type: "CHANGE_STATUS", timestamp: "2026-08-16T14:45:00Z", location: "Liege Medical Center", temp: 4.7, status: "Delivered", actor: "Clarissa Jones" }
  ]
};

export function AuditDashboard() {
  const [scrubIndex, setScrubIndex] = useState(MOCK_SHIPMENT.events.length - 1);
  const activeEvent = MOCK_SHIPMENT.events[scrubIndex];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif', color: '#f0f3f9' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <Database size={28} style={{ color: '#2563eb' }} />
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>AuditTrail Ledger Dashboard</h1>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#9aa4b7' }}>Event-Sourced Supply Chain Audit Ledger</p>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Left Side: Summary Card */}
        <aside style={{ background: '#111520', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.1rem', marginTop: 0 }}>{MOCK_SHIPMENT.name}</h2>
          <p style={{ fontSize: '0.8rem', color: '#9aa4b7' }}>ID: <code>{MOCK_SHIPMENT.id}</code></p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Box size={16} color="#2563eb" /> Container: <strong>{MOCK_SHIPMENT.containerId}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#10b981" /> Current Location: <strong>{activeEvent.location}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={16} color="#06b6d4" /> Current Temp: <strong>{activeEvent.temp}°C</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#f59e0b" /> Status: <strong>{activeEvent.status}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="#9aa4b7" /> Last Signatory: <strong>{activeEvent.actor}</strong>
            </div>
          </div>
        </aside>

        {/* Right Side: Replay Scrubber & Event Stream */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Replay Controller */}
          <div style={{ background: '#111520', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>Time-Travel Replay Controller</strong>
              <span style={{ fontSize: '0.8rem', color: '#9aa4b7' }}>Block {scrubIndex + 1} of {MOCK_SHIPMENT.events.length}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={MOCK_SHIPMENT.events.length - 1} 
              value={scrubIndex} 
              onChange={(e) => setScrubIndex(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Event Stream Log */}
          <div style={{ background: '#111520', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: '1rem', marginTop: 0 }}>Event Stream</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {MOCK_SHIPMENT.events.map((ev, idx) => (
                <div 
                  key={ev.index} 
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: idx === scrubIndex ? 'rgba(37, 99, 235, 0.2)' : '#161c2c',
                    border: idx === scrubIndex ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.05)',
                    opacity: idx > scrubIndex ? 0.35 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    <span>#{ev.index} {ev.type}</span>
                    <span>{ev.temp}°C</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9aa4b7', marginTop: '0.25rem' }}>
                    {ev.location} • {ev.actor} • {new Date(ev.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
