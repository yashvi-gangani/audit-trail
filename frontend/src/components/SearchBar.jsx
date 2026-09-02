import React, { useState } from 'react';
import { Search, X, Box, AlertTriangle, ShieldCheck, Compass, Clock } from 'lucide-react';

export function SearchBar({ shipments = [], selectedId, onSelect, loading }) {
  const [query, setQuery] = useState('');

  const filteredShipments = shipments.filter(s => 
    s.id?.toLowerCase().includes(query.toLowerCase()) || 
    s.name?.toLowerCase().includes(query.toLowerCase()) ||
    s.destination?.toLowerCase().includes(query.toLowerCase()) ||
    s.origin?.toLowerCase().includes(query.toLowerCase())
  );

  const getStatusBadge = (status = '') => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem' }}><ShieldCheck size={10} /> Delivered</span>;
      case 'damaged':
        return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem' }}><AlertTriangle size={10} /> Damaged</span>;
      case 'in transit':
        return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem' }}><Compass size={10} /> In Transit</span>;
      default:
        return <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{status || 'Pending'}</span>;
    }
  };

  return (
    <div className="search-sidebar-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      
      {/* Search Input Box */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search by ID, route, cargo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 2.25rem 0.75rem 2.4rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            outline: 'none',
            transition: 'border-color var(--transition-fast)'
          }}
        />
        <Search 
          size={16} 
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} 
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Catalog List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600' }}>
            Ledgers ({filteredShipments.length})
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(n => (
              <div key={n} className="card shimmer" style={{ height: '85px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}></div>
            ))}
          </div>
        ) : filteredShipments.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No ledgers match your search
          </div>
        ) : (
          filteredShipments.map(shipment => {
            const isSelected = shipment.id === selectedId;
            return (
              <div
                key={shipment.id}
                onClick={() => onSelect && onSelect(shipment.id)}
                style={{
                  padding: '0.85rem',
                  background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? '0 0 12px var(--primary-glow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Box size={14} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-secondary)' }} />
                    <span className="code" style={{ fontSize: '0.7rem' }}>{shipment.id}</span>
                  </div>
                  {getStatusBadge(shipment.status)}
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {shipment.name}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                    {shipment.destination}
                  </span>
                  {shipment.anomalyCount > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--danger)', fontWeight: '600', fontSize: '0.7rem' }}>
                      <AlertTriangle size={11} /> {shipment.anomalyCount} Alert
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SearchBar;
