import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/sidebar';
import StockPage from './pages/stockPage';

const PAGES = {
  spare_part_toner: StockPage,
  maintenance: () => (
    <div className="page-placeholder">
      <h1>Riwayat Perbaikan Mesin</h1>
      <p>Halaman ini belum dibuat.</p>
    </div>
  ),
  stock_usage: () => (
    <div className="page-placeholder">
      <h1>Penggunaan Stok oleh Teknisi</h1>
      <p>Halaman ini belum dibuat.</p>
    </div>
  ),
};

export default function App() {
  const [activeKey, setActiveKey] = useState('spare_part_toner');

  const handleNavigate = (key) => {
    setActiveKey(key);
    // arahkan ke routing di sini, misal: navigate(href)
  };

  const ActivePage = PAGES[activeKey] ?? PAGES.spare_part_toner;

  return (
    <div className="app-shell">
      <Sidebar activeKey={activeKey} onNavigate={handleNavigate} />

      <main className="app-content">
        <ActivePage />
      </main>
    </div>
  );
}