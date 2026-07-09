import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/sidebar';

/**
 * Contoh integrasi Sidebar ke dalam layout aplikasi.
 * Karena Sidebar berbentuk overlay (posisi fixed via Offcanvas),
 * konten utama TIDAK perlu diberi margin/padding tambahan saat sidebar terbuka.
 */
export default function App() {
  const [activeKey, setActiveKey] = useState('spare_part_toner');

  const handleNavigate = (key) => {
    setActiveKey(key);
    // arahkan ke routing di sini, misal: navigate(href)
  };

  return (
    <div className="app-shell">
      <Sidebar activeKey={activeKey} onNavigate={handleNavigate} />

      <main className="app-content">
        <h1>Konten Halaman: {activeKey}</h1>
        <p>
          Sidebar bersifat overlay, jadi elemen ini tidak akan terdorong
          ke kanan saat sidebar dibuka.
        </p>
      </main>
    </div>
  );
}