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
    Pagination,
    PaginationItem,
    PaginationLink,
} from 'reactstrap';
import {
    Search,
    Plus,
    Pencil,
    ArrowDownCircle,
    ArrowUpCircle,
    PackageSearch,
    Eye,
} from 'lucide-react';
import './style.css';
import { getMonthlyReport, getItemBranchUsage, stockIn, stockOut, getBranchOffices } from './funcAPICall';
import DetailModal from '../../components/detailModal';
import AddEditModal from '../../components/addEditModal';

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
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const [reportData, setReportData] = useState([]);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailTitle, setDetailTitle] = useState("");
    const [detailData, setDetailData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [editOpen, setEditOpen] = useState(false);
    const [transactionMode, setTransactionMode] = useState("IN"); // IN | OUT
    const [selectedItem, setSelectedItem] = useState(null);

    const [branchOffices, setBranchOffices] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadBranchOffices() {
            const result = await getBranchOffices();

            if (result.success) {
                setBranchOffices(result.data);
            }
        }

        loadBranchOffices();
    }, []);

    const [formData, setFormData] = useState({
        quantity_in: "",
        quantity_out: "",
        branch_office_id: "",
        note: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function loadData() {
            const result = await getMonthlyReport(
                selectedYear,
                selectedMonth,
                currentPage
            );

            if (result.success) {
                setReportData(result.data);
                setPagination(result.pagination);
            } else {
                setReportData([]);
                setPagination(null);
            }
        }

        loadData();
    }, [selectedYear, selectedMonth, currentPage]);

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
        setSelectedItem(item);

        // default ketika modal dibuka
        setTransactionMode("IN");

        setFormData({
            quantity_in: "",
            quantity_out: "",
            branch_office_id: "",
            note: "",
        });

        setErrors({});
        setEditOpen(true);
    };

    const handleChange = (name, value) => {
        if (name === "transaction_mode") {
            setTransactionMode(value);

            setFormData({
                quantity_in: "",
                quantity_out: "",
                branch_office_id: "",
                note: "",
            });

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const modalFields = [
        {
            name: "transaction_mode",
            label: "Mode Transaksi",
            type: "select",
            required: true,
            options: [
                {
                    value: "IN",
                    label: "Stock In",
                },
                {
                    value: "OUT",
                    label: "Stock Out",
                },
            ],
        },

        ...(transactionMode === "IN"
            ? [
                {
                    name: "quantity_in",
                    label: "Jumlah Stok Masuk",
                    type: "number",
                    required: true,
                    placeholder: "Masukkan jumlah stok masuk",
                },
            ]
            : [
                {
                    name: "branch_office_id",
                    label: "Cabang",
                    type: "searchable-select",
                    required: true,
                    placeholder: "Pilih cabang",
                    options: branchOffices.map(branch => ({
                        value: branch.id,
                        label: branch.name,
                    })),
                },
                {
                    name: "quantity_out",
                    label: "Jumlah Stok Keluar",
                    type: "number",
                    required: true,
                    placeholder: "Masukkan jumlah stok keluar",
                },
            ]),

        {
            name: "note",
            label: "Catatan",
            type: "textarea",
            rows: 3,
            required: false,
            full: true,
            placeholder: "Catatan (opsional)",
        },
    ];

    const handleSubmit = async () => {
        const newErrors = {};

        if (transactionMode === "IN" && !formData.quantity_in) {
            newErrors.quantity_in = "Jumlah stok masuk wajib diisi";
        }

        if (transactionMode === "OUT" && !formData.quantity_out) {
            newErrors.quantity_out = "Jumlah stok keluar wajib diisi";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            let result;

            if (transactionMode === "IN") {
                result = await stockIn({
                    item_id: selectedItem.id,
                    transaction_date: new Date().toISOString().split("T")[0],
                    quantity: Number(formData.quantity_in),
                    note: formData.note || "",
                });
            } else {
                result = await stockOut({
                    item_id: selectedItem.id,
                    branch_office_id: Number(formData.branch_office_id),
                    transaction_date: new Date().toISOString().split("T")[0],
                    quantity: Number(formData.quantity_out),
                    note: formData.note || "",
                });
            }

            if (!result.success) {
                alert(result.message);
                return;
            }

            setEditOpen(false);

            // Refresh tabel
            const refreshed = await getMonthlyReport(
                selectedYear,
                selectedMonth,
                currentPage
            );

            if (refreshed.success) {
                setReportData(refreshed.data);
                setPagination(refreshed.pagination);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDetail = async (item) => {
        const result = await getItemBranchUsage(
            item.id,
            selectedYear,
            selectedMonth
        );

        if (!result.success) {
            return;
        }

        const modalData = result.data.map((row, index) => {
            const isStockIn = row.transaction_type === "IN";

            return {
                label: `${isStockIn ? "Barang Masuk" : "Barang Keluar"}`,
                type: "longtext",
                full: true,
                labelBadge: true,
                labelVariant: isStockIn ? "success" : "danger",
                value: isStockIn ?
                    `Tanggal         : ${new Date(row.transaction_date).toLocaleDateString("id-ID")}\n` +
                    `Jumlah          : ${row.quantity}`
                    :
                    `Tanggal         : ${new Date(row.transaction_date).toLocaleDateString("id-ID")}\n` +
                    `Cabang          : ${row.branch_name}\n` +
                    `Jumlah          : ${row.quantity}`,
            };
        });

        setDetailTitle(item.item_name);
        setDetailData(modalData);
        setDetailOpen(true);
    };

    const MONTHS = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const YEARS = Array.from(
        { length: 10 },
        (_, i) => today.getFullYear() - 5 + i
    );

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
                        <Button color="primary" className="sp-btn-add" onClick={() => navigate('/stock-page')}>
                            <span>Stok Terkini</span>
                        </Button>

                        {/* <Button color="primary" className="sp-btn-add">
                            <Plus size={18} strokeWidth={2.25} />
                            <span>Tambah Mutasi</span>
                        </Button> */}
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
                                value={selectedMonth}
                                onChange={(e) => {
                                    setSelectedMonth(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                {MONTHS.map((month, index) => (
                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {month}
                                    </option>
                                ))}
                            </Input>

                            <Input
                                type="select"
                                className="sp-filter"
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                {YEARS.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </Input>

                            <Input
                                type="select"
                                className="sp-filter"
                                value={jenisFilter}
                                onChange={(e) => setJenisFilter(e.target.value)}
                                aria-label="Filter jenis barang"
                            >
                                <option value="Semua">Semua Jenis</option>
                                <option value="TONER">Toner</option>
                                <option value="SPAREPART">Spare Part</option>
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
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button
                                                            id={`detail-btn-${item.id}`}
                                                            color="info"
                                                            size="sm"
                                                            className="sp-btn-edit"
                                                            onClick={() => handleDetail(item)}
                                                            aria-label={`Detail ${item.item_name}`}
                                                        >
                                                            <Eye size={15} strokeWidth={2} />
                                                        </Button>

                                                        <UncontrolledTooltip
                                                            target={`detail-btn-${item.id}`}
                                                            placement="top"
                                                        >
                                                            Detail
                                                        </UncontrolledTooltip>
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
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                        {pagination && pagination.last_page > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <Pagination>

                                    <PaginationItem disabled={currentPage === 1}>
                                        <PaginationLink
                                            previous
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        />
                                    </PaginationItem>

                                    {Array.from(
                                        { length: pagination.last_page },
                                        (_, i) => (
                                            <PaginationItem
                                                key={i + 1}
                                                active={currentPage === i + 1}
                                            >
                                                <PaginationLink
                                                    onClick={() =>
                                                        setCurrentPage(i + 1)
                                                    }
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}

                                    <PaginationItem
                                        disabled={
                                            currentPage === pagination.last_page
                                        }
                                    >
                                        <PaginationLink
                                            next
                                            onClick={() =>
                                                setCurrentPage(currentPage + 1)
                                            }
                                        />
                                    </PaginationItem>

                                </Pagination>
                            </div>
                        )}
                    </CardBody>
                </Card>

                <DetailModal
                    isOpen={detailOpen}
                    toggle={() => setDetailOpen(false)}
                    eyebrow="Detail Pemakaian Cabang"
                    title={detailTitle}
                    subtitle={`${MONTHS[selectedMonth - 1]} ${selectedYear}`}
                    data={detailData}
                />

                <AddEditModal
                    isOpen={editOpen}
                    toggle={() => setEditOpen(false)}
                    title={selectedItem?.item_name || ""}
                    subtitle="Tambah Mutasi Stok"
                    fields={modalFields}
                    values={{
                        transaction_mode: transactionMode,
                        ...formData,
                    }}
                    errors={errors}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitLabel="Simpan"
                    isSubmitting={isSubmitting}
                />
            </Container>
        </div>
    );
}