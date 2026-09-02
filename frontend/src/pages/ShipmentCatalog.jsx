import React, { useState } from 'react';
import { Package, Search, MapPin, Thermometer, ShieldCheck, AlertTriangle, ArrowRight, Compass, Filter } from 'lucide-react';

const CATALOG_DATA = [
  {
    id: "SH-2026-9041",
    name: "BioCargo ColdChain (Therapeutic Insulins)",
    category: "Pharmaceuticals",
    status: "Delivered",
    origin: "Berlin Warehouse Hub",
    destination: "Liege Medical Research Center",
    lastUpdated: "2026-08-16T14:45:00Z",
    eventCount: 9,
    anomalyCount: 1,
    currentLocation: "Liege Medical Research Center",
    currentTemp: "4.7°C",
    containerId: "C-9812"
  },
  {
    id: "SH-2026-3022",
    name: "Quantum Processors Batch H-102",
    category: "High-Value Electronics",
    status: "Damaged",
    origin: "Shenzhen Factory Port",
    destination: "Copenhagen Sorting Depot",
    lastUpdated: "2026-08-18T06:00:00Z",
    eventCount: 4,
    anomalyCount: 1,
    currentLocation: "Copenhagen Sorting Depot",
    currentTemp: "21.5°C",
    containerId: "C-4401"
  },
  {
    id: "SH-2026-5510",
    name: "Cryogenic Vaccines Specimen Vault",
    category: "Biological",
    status: "In Transit",
    origin: "Munich BioPark Hub",
    destination: "Geneva WHO Laboratory",
    lastUpdated: "2026-08-19T11:20:00Z",
    eventCount: 6,
    anomalyCount: 0,
    currentLocation: "Zurich Transit Terminal",
    currentTemp: "2.1°C",
    containerId: "C-1109"
  },
  {
    id: "SH-2026-8801",
    name: "Automotive Sensor Arrays Batch B",
    category: "Industrial Equipment",
    status: "Pending",
    origin: "Stuttgart Factory Depot",
    destination: "Gothenburg Assembly Plant",
    lastUpdated: "2026-08-20T08:00:00Z",
    eventCount: 1,
    anomalyCount: 0,
    currentLocation: "Stuttgart Factory Depot",
    currentTemp: "19.2°C",
    containerId: "Not Assigned"
  }
];

export function ShipmentCatalog({ onSelectShipment }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = CATALOG_DATA.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && item.status.toUpperCase() === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <span className="badge badge-success"><ShieldCheck size={12} /> Delivered</span>;
      case 'damaged': return <span className="badge badge-danger"><AlertTriangle size={12} /> Damaged</span>;
      case 'in transit': return <span className="badge badge-info"><Compass size={12} /> In Transit</span>;
      default: return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '700' }}>Shipment Catalog</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Browse active and archived supply chain aggregate ledgers</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input 
              type="text" 
              placeholder="Search by ID, name, or route..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.4rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.6rem' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="ALL" style={{ background: 'var(--bg-secondary)' }}>All Statuses</option>
              <option value="IN TRANSIT" style={{ background: 'var(--bg-secondary)' }}>In Transit</option>
              <option value="DELIVERED" style={{ background: 'var(--bg-secondary)' }}>Delivered</option>
              <option value="DAMAGED" style={{ background: 'var(--bg-secondary)' }}>Damaged</option>
              <option value="PENDING" style={{ background: 'var(--bg-secondary)' }}>Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Shipment ID & Cargo</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Route (Origin → Dest)</th>
                <th style={{ padding: '1rem' }}>Telemetry</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No shipments match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr 
                    key={item.id}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Package size={18} style={{ color: 'var(--primary)' }} />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.name}</strong>
                          <span className="code" style={{ fontSize: '0.7rem' }}>{item.id}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {item.category}
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{item.origin}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        → {item.destination}
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                        <Thermometer size={14} style={{ color: 'var(--info)' }} />
                        {item.currentTemp}
                      </div>
                      {item.anomalyCount > 0 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                          <AlertTriangle size={11} /> {item.anomalyCount} Alert
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(item.status)}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectShipment(item.id)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: 'var(--primary-glow)',
                          color: 'var(--primary)',
                          border: '1px solid var(--primary)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        Audit Stream <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
