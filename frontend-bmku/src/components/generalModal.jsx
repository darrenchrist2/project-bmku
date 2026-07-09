import React from 'react';
import {
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback,
    Button,
    Spinner,
} from 'reactstrap';
import { X } from 'lucide-react';
import './GeneralModal.css';

/**
 * GeneralModal
 * -----------------------------------------------------------------------
 * Generic, form-driven modal built on reactstrap. Pass a `fields` array
 * and the component renders the right input for each entry — the number
 * and shape of fields is fully flexible, no fixed layout to edit later.
 *
 * Supported field.type: 'text' | 'email' | 'password' | 'number' | 'date'
 *                        | 'select' | 'textarea' | 'checkbox'
 *
 * field shape:
 * {
 *   name: 'itemName',        // key used in `values` / `errors` / onChange
 *   label: 'Nama Barang',
 *   type: 'text',
 *   placeholder: '...',
 *   required: true,
 *   disabled: false,
 *   full: false,             // true = span both columns on wide screens
 *   rows: 3,                 // textarea only
 *   helpText: 'Opsional',
 *   options: [{ value, label }] // select only
 * }
 */
const GeneralModal = ({
    isOpen,
    toggle,
    title,
    subtitle,
    fields = [],
    values = {},
    errors = {},
    onChange,
    onSubmit,
    submitLabel = 'Simpan',
    cancelLabel = 'Batal',
    isSubmitting = false,
    submitDisabled = false,
    size = 'md',
}) => {
    const handleFieldChange = (name, value) => {
        if (onChange) onChange(name, value);
    };

    const renderControl = (field) => {
        const {
            name,
            type = 'text',
            placeholder,
            options = [],
            required = false,
            disabled = false,
            rows = 3,
        } = field;

        const value = values[name] ?? (type === 'checkbox' ? false : '');
        const errorMsg = errors[name];

        const commonProps = {
            id: name,
            name,
            invalid: Boolean(errorMsg),
            disabled: disabled || isSubmitting,
            placeholder,
            required,
        };

        if (type === 'select') {
            return (
                <Input
                    type="select"
                    {...commonProps}
                    value={value}
                    onChange={(e) => handleFieldChange(name, e.target.value)}
                >
                    <option value="" disabled>
                        {placeholder || 'Pilih salah satu'}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </Input>
            );
        }

        if (type === 'textarea') {
            return (
                <Input
                    type="textarea"
                    rows={rows}
                    {...commonProps}
                    value={value}
                    onChange={(e) => handleFieldChange(name, e.target.value)}
                />
            );
        }

        if (type === 'checkbox') {
            return (
                <div className="rm-checkbox-row">
                    <Input
                        type="checkbox"
                        {...commonProps}
                        checked={Boolean(value)}
                        onChange={(e) => handleFieldChange(name, e.target.checked)}
                    />
                    <Label check for={name} className="rm-checkbox-label">
                        {field.label}
                    </Label>
                </div>
            );
        }

        return (
            <Input
                type={type}
                {...commonProps}
                value={value}
                onChange={(e) => handleFieldChange(name, e.target.value)}
            />
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            toggle={isSubmitting ? undefined : toggle}
            centered
            size={size}
            fade
            backdrop={isSubmitting ? "static" : true}
            keyboard={!isSubmitting}
            modalClassName="rm-modal-wrapper"
            backdropClassName="rm-backdrop"
            contentClassName="rm-content"
        >
            <div className="rm-header">
                <div className="rm-header-text">
                    <h2 className="rm-title">{title}</h2>
                    {subtitle && <p className="rm-subtitle">{subtitle}</p>}
                </div>
                <button
                    type="button"
                    className="rm-close-btn"
                    onClick={toggle}
                    disabled={isSubmitting}
                    aria-label="Tutup modal"
                >
                    <X size={18} strokeWidth={2.25} />
                </button>
            </div>

            <ModalBody className="rm-body">
                <Form className="rm-grid">
                    {fields.map((field, index) =>
                        field.type === 'checkbox' ? (
                            <FormGroup
                                key={field.name}
                                className={`rm-field ${field.full ? 'rm-field-full' : ''}`}
                                style={{ '--rm-delay': `${index * 35}ms` }}
                            >
                                {renderControl(field)}
                                {errors[field.name] && (
                                    <div className="rm-feedback-text">{errors[field.name]}</div>
                                )}
                            </FormGroup>
                        ) : (
                            <FormGroup
                                key={field.name}
                                className={`rm-field ${field.full ? 'rm-field-full' : ''}`}
                                style={{ '--rm-delay': `${index * 35}ms` }}
                            >
                                <Label for={field.name} className="rm-label">
                                    {field.label}
                                    {field.required && <span className="rm-required">*</span>}
                                </Label>
                                {renderControl(field)}
                                {errors[field.name] && (
                                    <FormFeedback className="rm-feedback-text">
                                        {errors[field.name]}
                                    </FormFeedback>
                                )}
                                {field.helpText && !errors[field.name] && (
                                    <div className="rm-help-text">{field.helpText}</div>
                                )}
                            </FormGroup>
                        )
                    )}
                </Form>
            </ModalBody>

            <ModalFooter className="rm-footer">
                <Button
                    type="button"
                    className="rm-btn rm-btn-ghost"
                    onClick={toggle}
                    disabled={isSubmitting}
                >
                    {cancelLabel}
                </Button>
                <Button
                    type="button"
                    className="rm-btn rm-btn-primary"
                    onClick={onSubmit}
                    disabled={isSubmitting || submitDisabled}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner size="sm" className="rm-spinner" />
                            <span>Memproses...</span>
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default GeneralModal;