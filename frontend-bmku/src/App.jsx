import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/sidebar';
import StockPage from './pages/stockPage';
import { ROUTES } from './navigation';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.stok} replace />} />
          <Route path={ROUTES.stok} element={<StockPage />} />
          <Route
            path={ROUTES.maintenance}
            element={(
              <div className="page-placeholder">
                <h1>Riwayat Perbaikan Mesin</h1>
                <p>Halaman ini belum dibuat.</p>
              </div>
            )}
          />
          <Route
            path={ROUTES.stockUsage}
            element={(
              <div className="page-placeholder">
                <h1>Penggunaan Stok oleh Teknisi</h1>
                <p>Halaman ini belum dibuat.</p>
              </div>
            )}
          />
          <Route
            path="*"
            element={(
              <div className="page-placeholder">
                <h1>404</h1>
                <p>Halaman tidak ditemukan.</p>
              </div>
            )}
          />
        </Routes>
      </main>
    </div>
  );
}