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
    Spinner,
    Pagination,
    PaginationItem,
    PaginationLink,
} from 'reactstrap';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    ArrowDownCircle,
    ArrowUpCircle,
    PackageSearch,
} from 'lucide-react';
import './style.css';
import { getCurrentStocks, createInventoryItem, updateInventoryItem, deleteInventoryItem } from './funcAPICall';
import { toast } from 'react-toastify';
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

export default function StockPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [jenisFilter, setJenisFilter] = useState('Semua');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // add | edit
    const [selectedItem, setSelectedItem] = useState(null);

    const closeModal = () => {
        if (isSubmitting) return;

        setIsModalOpen(false);
        setSelectedItem(null);
        setModalMode("add");
        setFormErrors({});
    };

    const openAddModal = () => {
        setModalMode("add");

        setFormValues({
            item_name: "",
            category: "",
            quantity: "",
        });

        setFormErrors({});
        setIsModalOpen(true);
    };

    const [formValues, setFormValues] = useState({
        item_name: '',
        category: '',
        quantity: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (name, value) => {
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const modalFields = [
        {
            name: 'item_name',
            label: 'Nama Barang',
            type: 'text',
            required: true,
            placeholder: 'Masukkan nama barang',
        },
        {
            name: 'category',
            label: 'Kategori',
            type: 'select',
            required: true,
            placeholder: 'Pilih kategori',
            options: [
                {
                    value: 'TONER',
                    label: 'Toner',
                },
                {
                    value: 'SPAREPART',
                    label: 'Spare Part',
                },
            ],
        },
        {
            name: 'quantity',
            label: 'Jumlah',
            type: 'number',
            required: true,
            placeholder: 'cth: 10',
        },
    ];

    const editModalFields = [
        {
            name: "item_name",
            label: "Nama Barang",
            type: "text",
            required: true,
            placeholder: "Masukkan nama barang",
        },
        {
            name: "category",
            label: "Kategori",
            type: "select",
            required: true,
            placeholder: "Pilih kategori",
            options: [
                {
                    value: "TONER",
                    label: "Toner",
                },
                {
                    value: "SPAREPART",
                    label: "Spare Part",
                },
            ],
        },
    ];

    const handleCreate = async () => {
        setIsSubmitting(true);

        try {
            const payload = {
                item_code: `ITM-${Date.now()}`,
                item_name: formValues.item_name,
                category: formValues.category,
                unit: "PCS",
                quantity: formValues.quantity,
                transaction_date: new Date().toISOString().split("T")[0],
                note: "Initial Stock",
            };

            const result = await createInventoryItem(payload);

            if (result.success) {
                await loadInventoryItems(currentPage);
                toast.success(result.message);

                setFormValues({
                    item_name: "",
                    category: "",
                    quantity: "",
                });

                setFormErrors({});

                closeModal();
            } else {
                if (result.errors) {
                    setFormErrors(result.errors);
                }

                // alert(result.message);
                toast.error(result.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        setIsSubmitting(true);

        try {
            const payload = {
                item_name: formValues.item_name,
                category: formValues.category,
            };

            const result = await updateInventoryItem(
                selectedItem.id,
                payload
            );

            if (result.success) {
                await loadInventoryItems(currentPage);
                toast.success(result.message);
                setFormValues({
                    item_name: "",
                    category: "",
                });

                setFormErrors({});
                closeModal();
            } else {
                if (result.errors) {
                    setFormErrors(result.errors);
                }

                // alert(result.message);
                toast.error(result.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        loadInventoryItems(currentPage);
    }, [currentPage]);

    const loadInventoryItems = async (page = currentPage) => {
        try {
            setLoading(true);

            const result = await getCurrentStocks(page);

            if (result.success) {
                setStockData(result.data);
                setPagination(result.pagination);
            } else {
                toast.error(result.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return stockData.filter((item) => {
            const matchSearch = item.item_name
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase());
            const matchJenis = jenisFilter === 'Semua' || item.category === jenisFilter;
            return matchSearch && matchJenis;
        });
    }, [stockData, searchTerm, jenisFilter]);

    const handleEdit = (item) => {
        setModalMode("edit");
        setSelectedItem(item);

        setFormValues({
            item_name: item.item_name,
            category: item.category,
        });

        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus barang ini?")) {
            return;
        }

        setIsDeleting(true);
        setDeletingId(id);

        try {
            const result = await deleteInventoryItem(id);

            if (result.success) {
                await loadInventoryItems(currentPage);
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    return (
        <div className="sp-page">
            <Container fluid className="sp-container">
                <div className="sp-page-header">
                    <div>
                        <h1 className="sp-title">Stok Spare Part &amp; Toner yang Tersedia</h1>
                        <p className="sp-subtitle">
                            Pantau stok yang tersedia untuk kebutuhan spare part dan toner mesin printer.
                        </p>
                    </div>
                    <div className="sp-actions">
                        <Button disabled={isDeleting} color="primary" className="sp-btn-add sp-btn-list" onClick={() => navigate('/spare-part-toner')}>
                            <span>Kembali</span>
                        </Button>
                        <Button disabled={isDeleting} color="primary" className="sp-btn-add" onClick={openAddModal}>
                            <Plus size={18} strokeWidth={2.25} />
                            <span>Tambah Barang</span>
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
                                        <th className="sp-col-center">Jumlah Terkini</th>
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
                                        const jenisCfg = JENIS_CONFIG[item.category];
                                        return (
                                            <tr key={item.id}>
                                                <td className="sp-nama">{item.item_name}</td>
                                                <td>
                                                    <Badge
                                                        pill
                                                        color={jenisCfg.color}
                                                        className={`sp-badge ${jenisCfg.className}`}
                                                    >
                                                        {item.category}
                                                    </Badge>
                                                </td>
                                                <td className="sp-col-center sp-jumlah">{item.current_stock} {item.unit}</td>
                                                <td className="sp-col-center">
                                                    <Button
                                                        id={`edit-btn-${item.id}`}
                                                        disabled={isDeleting}
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

                                                    {item.current_stock <= 0 && (
                                                        <>
                                                            <Button
                                                                id={`delete-btn-${item.id}`}
                                                                color="light"
                                                                size="sm"
                                                                className="sp-btn-delete"
                                                                onClick={() => handleDelete(item.id)}
                                                                aria-label={`Hapus ${item.item_name}`}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting && deletingId === item.id ? (
                                                                    <Spinner size="sm" />
                                                                ) : (
                                                                    <Trash2 size={15} strokeWidth={2} />
                                                                )}
                                                            </Button>

                                                            <UncontrolledTooltip
                                                                target={`delete-btn-${item.id}`}
                                                                placement="top"
                                                            >
                                                                Hapus
                                                            </UncontrolledTooltip>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                            {pagination && pagination.last_page > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>

                                        <PaginationItem disabled={currentPage === 1}>
                                            <PaginationLink
                                                previous
                                                onClick={() =>
                                                    setCurrentPage(currentPage - 1)
                                                }
                                            />
                                        </PaginationItem>

                                        {Array.from(
                                            { length: pagination.last_page },
                                            (_, index) => (
                                                <PaginationItem
                                                    key={index + 1}
                                                    active={currentPage === index + 1}
                                                >
                                                    <PaginationLink
                                                        onClick={() =>
                                                            setCurrentPage(index + 1)
                                                        }
                                                    >
                                                        {index + 1}
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
                        </div>
                    </CardBody>
                </Card>
            </Container>

            <AddEditModal
                isOpen={isModalOpen}
                toggle={closeModal}
                title={
                    modalMode === "add"
                        ? "Tambah Barang"
                        : "Edit Barang"
                }
                subtitle={
                    modalMode === "add"
                        ? "Tambahkan data barang baru."
                        : "Perbarui data barang."
                }
                fields={
                    modalMode === "add"
                        ? modalFields
                        : editModalFields
                }
                values={formValues}
                errors={formErrors}
                onChange={handleChange}
                onSubmit={
                    modalMode === "add"
                        ? handleCreate
                        : handleUpdate
                }
                submitLabel={
                    modalMode === "add"
                        ? "Simpan"
                        : "Perbarui"
                }
                isSubmitting={isSubmitting}
            />
        </div>
    );
}