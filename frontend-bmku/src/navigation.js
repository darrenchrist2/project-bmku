import { Printer, Wrench, FileBarChart2 } from 'lucide-react';

export const ROUTES = {
    stok: '/stok-spare-part-toner',
    maintenance: '/riwayat-perbaikan-mesin',
    stockUsage: '/penggunaan-stok-teknisi',
};

export const NAV_ITEMS = [
    {
        key: 'spare_part_toner',
        label: 'Stok Spare Part & Toner',
        icon: Printer,
        path: ROUTES.stok,
    },
    {
        key: 'maintenance',
        label: 'Riwayat Perbaikan Mesin',
        icon: Wrench,
        path: ROUTES.maintenance,
    },
    {
        key: 'stock_usage',
        label: 'Penggunaan Stok oleh Teknisi',
        icon: FileBarChart2,
        path: ROUTES.stockUsage,
    },
];