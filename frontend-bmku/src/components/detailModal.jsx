import React from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import { X, Copy, ExternalLink, Check, ImageOff } from 'lucide-react';
import './detailModal.css';

/**
 * DetailModal
 * -----------------------------------------------------------------------
 * Read-only counterpart to AddEditModal. Purely for *displaying* a row's
 * data inside a table (view details), never for editing — there is no
 * form state, no validation, no onChange. Same visual family as
 * AddEditModal (indigo accent, Manrope/Work Sans, rm- shadow + radius
 * tokens) but rendered as a definition-list, not inputs.
 *
 * Usage:
 * <DetailModal
 *   isOpen={isDetailOpen}
 *   toggle={toggleDetail}
 *   eyebrow="Stok Spare Part & Toner"
 *   title="Toner Cartridge HP 26A"
 *   subtitle="ID: SP-0032"
 *   onEdit={() => openEdit(row)}          // optional
 *   data={[
 *     { label: 'Kategori', value: 'Toner', type: 'badge', badgeVariant: 'info' },
 *     { label: 'Stok Tersedia', value: 12, type: 'number', unit: 'pcs' },
 *     { label: 'Status', value: true, type: 'boolean', trueLabel: 'Tersedia', falseLabel: 'Habis' },
 *     { label: 'Tanggal Masuk', value: '2026-05-14', type: 'date' },
 *     { label: 'Kode SKU', value: 'SP-HP26A-BLK', type: 'text', mono: true, copyable: true },
 *     { label: 'Catatan', value: 'Kompatibel dengan printer LaserJet Pro M402.', type: 'longtext', full: true },
 *   ]}
 * />
 *
 * data[] field shape:
 * {
 *   label: string,
 *   value: any,
 *   type: 'text' | 'number' | 'date' | 'badge' | 'boolean' | 'link' | 'image' | 'longtext',
 *   full: boolean,        // span both columns on wide screens
 *   mono: boolean,        // render value in IBM Plex Mono-esque monospace styling (codes/IDs)
 *   copyable: boolean,    // show a copy-to-clipboard affordance
 *   unit: string,         // suffix for 'number' (e.g. 'pcs', 'unit')
 *   badgeVariant: 'success' | 'warning' | 'danger' | 'info' | 'neutral',
 *   trueLabel / falseLabel: string, // for 'boolean'
 *   emptyText: string,    // fallback shown when value is null/undefined/''
 * }
 */

const formatDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const CopyableValue = ({ text, children }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(String(text));
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            // clipboard unavailable — fail silently, no crash
        }
    };

    return (
        <button type="button" className="dm-copy-trigger" onClick={handleCopy} aria-label="Salin nilai">
            {children}
            <span className={`dm-copy-icon ${copied ? 'is-copied' : ''}`}>
                {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.25} />}
            </span>
        </button>
    );
};

const FieldValue = ({ field }) => {
    const {
        value,
        type = 'text',
        unit,
        mono = false,
        copyable = false,
        badgeVariant = 'neutral',
        trueLabel = 'Ya',
        falseLabel = 'Tidak',
        emptyText = '—',
    } = field;

    const isEmpty = value === null || value === undefined || value === '';

    if (isEmpty && type !== 'boolean') {
        return <span className="dm-value dm-value-empty">{emptyText}</span>;
    }

    switch (type) {
        case 'badge':
            return (
                <span className={`dm-badge dm-badge-${badgeVariant}`}>
                    <span className="dm-badge-dot" />
                    {value}
                </span>
            );

        case 'boolean':
            return (
                <span className={`dm-badge ${value ? 'dm-badge-success' : 'dm-badge-danger'}`}>
                    <span className="dm-badge-dot" />
                    {value ? trueLabel : falseLabel}
                </span>
            );

        case 'date':
            return <span className="dm-value">{formatDate(value) || emptyText}</span>;

        case 'number':
            return (
                <span className="dm-value dm-value-number">
                    {value}
                    {unit && <span className="dm-unit">{unit}</span>}
                </span>
            );

        case 'link':
            return (
                <a href={value} target="_blank" rel="noopener noreferrer" className="dm-link">
                    {value}
                    <ExternalLink size={13} strokeWidth={2.25} />
                </a>
            );

        case 'image':
            return (
                <div className="dm-image-frame">
                    {value ? (
                        <img src={value} alt={field.label} loading="lazy" />
                    ) : (
                        <div className="dm-image-fallback">
                            <ImageOff size={20} strokeWidth={1.75} />
                        </div>
                    )}
                </div>
            );

        case 'longtext':
            return <p className="dm-value dm-value-long">{value}</p>;

        case 'text':
        default: {
            const content = (
                <span className={`dm-value ${mono ? 'dm-value-mono' : ''}`}>{value}</span>
            );
            return copyable ? <CopyableValue text={value}>{content}</CopyableValue> : content;
        }
    }
};

const DetailModal = ({
    isOpen,
    toggle,
    eyebrow,
    title,
    subtitle,
    data = [],
    onEdit,
    editLabel = 'Edit Data',
    closeLabel = 'Tutup',
    size = 'md',
}) => {
    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            centered
            size={size}
            fade
            modalClassName="rm-modal-wrapper"
            backdropClassName="rm-backdrop"
            contentClassName="rm-content dm-content"
        >
            <div className="rm-header dm-header">
                <div className="rm-header-text">
                    {eyebrow && <p className="dm-eyebrow">{eyebrow}</p>}
                    <h2 className="rm-title">{title}</h2>
                    {subtitle && <p className="rm-subtitle">{subtitle}</p>}
                </div>
                <button type="button" className="rm-close-btn" onClick={toggle} aria-label="Tutup modal">
                    <X size={18} strokeWidth={2.25} />
                </button>
            </div>

            <ModalBody className="rm-body dm-body">
                <dl className="dm-grid">
                    {data.map((field, index) => (
                        <div
                            key={field.label + index}
                            className={`dm-field ${field.full ? 'rm-field-full' : ''}`}
                            style={{ '--rm-delay': `${index * 35}ms` }}
                        >
                            <dt className="rm-label dm-dt">{field.label}</dt>
                            <dd className="dm-dd">
                                <FieldValue field={field} />
                            </dd>
                        </div>
                    ))}
                </dl>
            </ModalBody>

            <ModalFooter className="rm-footer">
                {onEdit && (
                    <Button type="button" className="rm-btn rm-btn-ghost" onClick={onEdit}>
                        {editLabel}
                    </Button>
                )}
                <Button type="button" className="rm-btn rm-btn-primary" onClick={toggle}>
                    {closeLabel}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DetailModal;