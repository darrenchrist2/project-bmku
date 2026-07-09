import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Sidebar from './components/Sidebar';

import InventoryItems from './pages/InventoryItems';

export default function App() {
    const [activeKey, setActiveKey] = useState('spare_part_toner');
    const navigate = useNavigate();

    const handleNavigate = (key, href) => {
        setActiveKey(key);
        navigate(href);
    };

    return (
        <>
            <Sidebar
                activeKey={activeKey}
                onNavigate={handleNavigate}
            />

            <main className="app-content">
                <Routes>
                    <Route
                        path="/"
                        element={<InventoryItems />}
                    />

                    <Route
                        path="/inventory-items"
                        element={<InventoryItems />}
                    />

                    <Route
                        path="/maintenance"
                        element={<InventoryItems />}
                    />

                    <Route
                        path="/stock-usage"
                        element={<InventoryItems />}
                    />
                </Routes>
            </main>
        </>
    );
}