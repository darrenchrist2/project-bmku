import { Printer, Wrench, FileBarChart2, Package } from 'lucide-react';

export const ROUTES = {
    spare_part_toner: '/spare-part-toner',
    maintenance: '/riwayat-perbaikan-mesin',
    stockUsage: '/penggunaan-stok-teknisi',
    stockPage: '/stock-page',
};

export const NAV_ITEMS = [
    {
        key: 'spare_part_toner',
        label: 'Spare Part & Toner',
        icon: Printer,
        path: ROUTES.spare_part_toner,
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
    {
        key: 'stock_page',
        label: 'Stok Terkini',
        icon: Package,
        path: ROUTES.stockPage,
    }
    
];