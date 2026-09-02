import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuditDashboard } from './pages/AuditDashboard';
import { ShipmentCatalog } from './pages/ShipmentCatalog';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SearchBar } from './components/SearchBar';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleSelectShipment = (shipmentId) => {
    setActiveTab('dashboard');
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div style={{ flex: 1 }}>
        {activeTab === 'home' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'dashboard' && <AuditDashboard />}
        {activeTab === 'catalog' && <ShipmentCatalog onSelectShipment={handleSelectShipment} />}
        {activeTab === 'analytics' && <AnalyticsPage />}
      </div>
    </div>
  );
}

export default App;