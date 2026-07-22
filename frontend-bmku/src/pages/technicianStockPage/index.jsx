import React, { useState, useMemo, useEffect } from 'react';
import {
    Container,
    Card,
    CardBody,
    Table,
    Button,
    Input,
    InputGroup,
    InputGroupText,
    UncontrolledTooltip,
    Pagination,
    PaginationItem,
    PaginationLink,
} from 'reactstrap';
import {
    Search,
    Pencil,
    PackageSearch,
    Eye,
} from 'lucide-react';
import './style.css';
import {
    getTechnicianMonthlyUsage, createTechnicianStock, getInventoryItems,
} from './funcAPICall';
import DetailModal from '../../components/detailModal';
import AddEditModal from '../../components/addEditModal';
import { toast } from 'react-toastify';

export default function TechnicianStockPage() {
    const [searchTerm, setSearchTerm] = useState('');
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
    const [selectedItem, setSelectedItem] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [inventoryItems, setInventoryItems] = useState([]);

    useEffect(() => {
        async function loadItems() {
            const result = await getInventoryItems();

            if (result.success) {
                setInventoryItems(result.data);
            }
        }

        loadItems();
    }, []);

    const [formData, setFormData] = useState({
        item_id: "",
        transaction_date: new Date().toISOString().split("T")[0],
        quantity: "",
        note: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function loadData() {
            const result = await getTechnicianMonthlyUsage(
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
        return reportData.filter((technician) =>
            technician.technician_name
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase())
        );
    }, [reportData, searchTerm]);

    const closeModal = () => {
        setEditOpen(false);
        setSelectedItem(null);
    };

    const handleEdit = (technician) => {
        setSelectedItem(technician);

        setFormData({
            item_id: "",
            transaction_date: new Date().toISOString().split("T")[0],
            quantity: "",
            note: "",
        });

        setErrors({});
        setEditOpen(true);
    };

    const handleChange = (name, value) => {

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const modalFields = [
        {
            name: "item_id",
            label: "Barang",
            type: "searchable-select",
            required: true,
            placeholder: "Pilih barang",
            options: inventoryItems.map(item => ({
                value: item.id,
                label: item.item_name,
            })),
        },
        {
            name: "transaction_date",
            label: "Tanggal Pengambilan",
            type: "date",
            required: true,
        },
        {
            name: "quantity",
            label: "Jumlah",
            type: "number",
            required: true,
            placeholder: "Masukkan jumlah",
        },
        {
            name: "note",
            label: "Catatan",
            type: "textarea",
            rows: 3,
            full: true,
        },
    ];

    const handleSubmit = async () => {
        const newErrors = {};

        if (!formData.item_id)
            newErrors.item_id = "Barang wajib dipilih";

        if (!formData.quantity)
            newErrors.quantity = "Jumlah wajib diisi";

        if (!formData.transaction_date)
            newErrors.transaction_date = "Tanggal wajib diisi";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createTechnicianStock({
                technician_id: selectedItem.technician_id,
                item_id: Number(formData.item_id),
                transaction_date: formData.transaction_date,
                quantity: Number(formData.quantity),
                note: formData.note,
            });

            if (!result.success) {
                toast.error(result.message);
                setErrors(result.errors ?? {});
                return;
            }

            toast.success(result.message);

            setEditOpen(false);

            const refreshed = await getTechnicianMonthlyUsage(
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

    const handleDetail = (technician) => {
        const modalData = technician.items.flatMap((item) => [
            {
                label: item.item_name,
                labelBadge: true,
                labelVariant: "info",
                value: item.total_quantity,
                type: "number",
                unit: "PCS",
                full: true,
            },
        ]);

        setDetailTitle(technician.technician_name);
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
                        <h1 className="sp-title">Penggunaan Stok Spare Part &amp; Toner oleh Teknisi</h1>
                        <p className="sp-subtitle">
                            Pantau penggunaan spare part dan toner mesin printer oleh para teknisi.
                        </p>
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
                                    placeholder="Cari nama teknisi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Cari nama teknisi"
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
                        </div>

                        <div className="sp-table-wrap">
                            <Table responsive borderless className="sp-table">
                                <thead>
                                    <tr>
                                        <th>Nama Teknisi</th>
                                        <th className="sp-col-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="sp-empty">
                                                <PackageSearch size={28} strokeWidth={1.5} />
                                                <span>Tidak ada data yang cocok.</span>
                                            </td>
                                        </tr>
                                    )}

                                    {filteredData.map((technician) => {
                                        return (
                                            <tr key={technician.technician_id}>
                                                <td className="sp-nama">
                                                    {technician.technician_name}
                                                </td>

                                                <td className="sp-col-center">
                                                    <div className="d-flex justify-content-center gap-2">

                                                        <Button
                                                            id={`detail-btn-${technician.technician_id}`}
                                                            color="info"
                                                            size="sm"
                                                            className="sp-btn-edit"
                                                            onClick={() => handleDetail(technician)}
                                                        >
                                                            <Eye size={15} />
                                                        </Button>

                                                        <UncontrolledTooltip
                                                            target={`detail-btn-${technician.technician_id}`}
                                                        >
                                                            Detail
                                                        </UncontrolledTooltip>

                                                        <Button
                                                            id={`edit-btn-${technician.technician_id}`}
                                                            color="light"
                                                            size="sm"
                                                            className="sp-btn-edit"
                                                            onClick={() => handleEdit(technician)}
                                                        >
                                                            <Pencil size={15} />
                                                        </Button>

                                                        <UncontrolledTooltip
                                                            target={`edit-btn-${technician.technician_id}`}
                                                        >
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
                    eyebrow="Detail Penggunaan stok oleh teknisi"
                    title={detailTitle}
                    subtitle={`${MONTHS[selectedMonth - 1]} ${selectedYear}`}
                    data={detailData}
                />

                <AddEditModal
                    isOpen={editOpen}
                    toggle={closeModal}
                    title={selectedItem?.technician_name || ""}
                    subtitle="Tambah Penggunaan Sparepart / Toner"
                    fields={modalFields}
                    values={{
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