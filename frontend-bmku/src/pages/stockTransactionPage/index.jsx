import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardBody,
    Table,
    Button,
    Input,
    InputGroup,
    InputGroupText,
    Badge,
    UncontrolledTooltip,
} from 'reactstrap';
import {
    Search,
    Plus,
    Pencil,
    ArrowDownCircle,
    ArrowUpCircle,
    PackageSearch,
} from 'lucide-react';
import './style.css';

/**
 * StockPage - Halaman "Stok Spare Part & Toner".
 *
 * Tema: Modern White - kartu putih dengan shadow lembut, aksen warna
 * indigo untuk aksi utama, badge berwarna untuk membedakan jenis barang.
 * Sengaja dibuat berbeda arah visual dari Sidebar (industrial) karena
 * area konten halaman & shell navigasi memang punya peran berbeda.
 *
 * Data di bawah ini seluruhnya dummy - hanya untuk kebutuhan tampilan.
 */

const JENIS_CONFIG = {
    Toner: { color: 'primary', className: 'sp-badge--toner' },
    'Spare Part': { color: 'warning', className: 'sp-badge--sparepart' },
};

const DUMMY_STOCK = [
    { id: 1, tanggal: '2026-07-08', tipeMutasi: 'masuk', nama: 'Toner HP LaserJet 26A', jenis: 'Toner', jumlah: 24 },
    { id: 2, tanggal: '2026-07-07', tipeMutasi: 'keluar', nama: 'Drum Unit Canon LBP2900', jenis: 'Spare Part', jumlah: 3 },
    { id: 3, tanggal: '2026-07-06', tipeMutasi: 'masuk', nama: 'Toner Brother TN-2130', jenis: 'Toner', jumlah: 15 },
    { id: 4, tanggal: '2026-07-05', tipeMutasi: 'keluar', nama: 'Roller Feed Epson L3110', jenis: 'Spare Part', jumlah: 6 },
    { id: 5, tanggal: '2026-07-04', tipeMutasi: 'masuk', nama: 'Toner Samsung MLT-D111S', jenis: 'Toner', jumlah: 18 },
    { id: 6, tanggal: '2026-07-03', tipeMutasi: 'masuk', nama: 'Cartridge Head Canon G2010', jenis: 'Spare Part', jumlah: 10 },
    { id: 7, tanggal: '2026-07-02', tipeMutasi: 'keluar', nama: 'Toner HP LaserJet 12A', jenis: 'Toner', jumlah: 5 },
    { id: 8, tanggal: '2026-07-01', tipeMutasi: 'keluar', nama: 'Fuser Unit Brother HL-2270', jenis: 'Spare Part', jumlah: 2 },
];

function formatTanggal(isoDate) {
    const date = new Date(`${isoDate}T00:00:00`);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function StockTransactionPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [jenisFilter, setJenisFilter] = useState('Semua');

    const filteredData = useMemo(() => {
        return DUMMY_STOCK.filter((item) => {
            const matchSearch = item.nama
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());
            const matchJenis = jenisFilter === 'Semua' || item.jenis === jenisFilter;
            return matchSearch && matchJenis;
        });
    }, [searchTerm, jenisFilter]);

    const handleEdit = (item) => {
        // Integrasikan dengan modal/route edit di implementasi sebenarnya.
        // eslint-disable-next-line no-console
        console.log('Edit stok:', item);
    };

    return (
        <div className="sp-page">
            <Container fluid className="sp-container">
                <div className="sp-page-header">
                    <div>
                        <h1 className="sp-title">Aliran Stok Spare Part &amp; Toner</h1>
                        <p className="sp-subtitle">
                            Pantau mutasi stok masuk dan keluar untuk kebutuhan spare part dan toner mesin printer.
                        </p>
                    </div>
                    <div className="sp-actions">
                        <Button color="primary" className="sp-btn-add sp-btn-list" onClick={() => navigate('/stock-page')}>
                            <span>Stok Terkini</span>
                        </Button>

                        <Button color="primary" className="sp-btn-add">
                            <Plus size={18} strokeWidth={2.25} />
                            <span>Tambah Mutasi</span>
                        </Button>
                    </div>
                </div>

                <Card className="sp-card">
                    <CardBody className="sp-card-body">
                        <div className="sp-toolbar">
                            <InputGroup className="sp-search">
                                <InputGroupText className="sp-search__icon">
                                    <Search size={16} strokeWidth={2} />
                                </InputGroupText>
                                <Input
                                    type="text"
                                    placeholder="Cari nama barang..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Cari nama barang"
                                />
                            </InputGroup>

                            <Input
                                type="select"
                                className="sp-filter"
                                value={jenisFilter}
                                onChange={(e) => setJenisFilter(e.target.value)}
                                aria-label="Filter jenis barang"
                            >
                                <option value="Semua">Semua Jenis</option>
                                <option value="Toner">Toner</option>
                                <option value="Spare Part">Spare Part</option>
                            </Input>
                        </div>

                        <div className="sp-table-wrap">
                            <Table responsive borderless className="sp-table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Nama Barang</th>
                                        <th>Jenis Barang</th>
                                        <th className="sp-col-center">Jumlah</th>
                                        <th className="sp-col-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="sp-empty">
                                                <PackageSearch size={28} strokeWidth={1.5} />
                                                <span>Tidak ada data yang cocok.</span>
                                            </td>
                                        </tr>
                                    )}

                                    {filteredData.map((item) => {
                                        const isMasuk = item.tipeMutasi === 'masuk';
                                        const jenisCfg = JENIS_CONFIG[item.jenis];
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="sp-tanggal">
                                                        {isMasuk ? (
                                                            <ArrowDownCircle size={16} className="sp-icon-masuk" aria-hidden="true" />
                                                        ) : (
                                                            <ArrowUpCircle size={16} className="sp-icon-keluar" aria-hidden="true" />
                                                        )}
                                                        <span>{formatTanggal(item.tanggal)}</span>
                                                    </div>
                                                </td>
                                                <td className="sp-nama">{item.nama}</td>
                                                <td>
                                                    <Badge
                                                        pill
                                                        color={jenisCfg.color}
                                                        className={`sp-badge ${jenisCfg.className}`}
                                                    >
                                                        {item.jenis}
                                                    </Badge>
                                                </td>
                                                <td className="sp-col-center sp-jumlah">{item.jumlah}</td>
                                                <td className="sp-col-center">
                                                    <Button
                                                        id={`edit-btn-${item.id}`}
                                                        color="light"
                                                        size="sm"
                                                        className="sp-btn-edit"
                                                        onClick={() => handleEdit(item)}
                                                        aria-label={`Edit stok ${item.nama}`}
                                                    >
                                                        <Pencil size={15} strokeWidth={2} />
                                                    </Button>
                                                    <UncontrolledTooltip target={`edit-btn-${item.id}`} placement="top">
                                                        Edit
                                                    </UncontrolledTooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
}