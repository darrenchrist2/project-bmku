import React, { useState, useMemo, useEffect } from 'react';
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
import { getMonthlyReport } from './funcAPICall';

const JENIS_CONFIG = {
    TONER: {
        color: "primary",
        className: "sp-badge--toner",
    },
    SPAREPART: {
        color: "warning",
        className: "sp-badge--sparepart",
    },
};

// function formatTanggal(isoDate) {
//     const date = new Date(`${isoDate}T00:00:00`);
//     return date.toLocaleDateString('id-ID', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//     });
// }

export default function StockTransactionPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [jenisFilter, setJenisFilter] = useState('Semua');

    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        async function loadData() {
            const today = new Date();

            const result = await getMonthlyReport(
                today.getFullYear(),
                today.getMonth() + 1
            );

            if (result.success) {
                setReportData(result.data);
            } else {
                setReportData([]);
                console.error(result.message);
            }
        }

        loadData();
    }, []);

    const filteredData = useMemo(() => {
        return reportData.filter((item) => {
            const matchSearch = item.item_name
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());

            const matchJenis =
                jenisFilter === 'Semua' ||
                item.category === jenisFilter;

            return matchSearch && matchJenis;
        });
    }, [reportData, searchTerm, jenisFilter]);

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
                                        <th>Nama Barang</th>
                                        <th>Jenis Barang</th>

                                        <th className="sp-col-center">
                                            <ArrowDownCircle
                                                size={16}
                                                className="sp-icon-masuk me-1"
                                            />
                                            Jumlah Masuk
                                        </th>

                                        <th className="sp-col-center">
                                            <ArrowUpCircle
                                                size={16}
                                                className="sp-icon-keluar me-1"
                                            />
                                            Jumlah Keluar
                                        </th>

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
                                        return (
                                            <tr key={item.id}>
                                                <td className="sp-nama">
                                                    {item.item_name}
                                                </td>

                                                <td>
                                                    <Badge
                                                        pill
                                                        color={JENIS_CONFIG[item.category]?.color}
                                                        className={`sp-badge ${JENIS_CONFIG[item.category]?.className || ""}`}
                                                    >
                                                        {item.category}
                                                    </Badge>
                                                </td>

                                                <td className="sp-col-center sp-jumlah">
                                                    {item.total_in}
                                                </td>

                                                <td className="sp-col-center sp-jumlah">
                                                    {item.total_out}
                                                </td>

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