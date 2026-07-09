import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import {Menu, ChevronRight} from 'lucide-react';
import './sidebar.css';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../navigation';

// Data dummy - hanya untuk tampilan, belum terhubung ke sumber data nyata.
const DUMMY_USER = {
    name: 'User1',
    role: 'Owner',
    avatarInitial: 'U1',
};

export default function Sidebar({ activeKey, onNavigate }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);

    const handleNavClick = useCallback(
        (event, item) => {
            event.preventDefault();
            if (onNavigate) onNavigate(item.key, item.href);
            close();
        },
        [onNavigate, close]
    );

    return (
        <>
            {!isOpen && (
                <button
                    type="button"
                    className="sb-toggle-btn"
                    onClick={toggle}
                    aria-label="Buka menu navigasi"
                    aria-expanded={isOpen}
                >
                    <Menu size={22} strokeWidth={2.25} aria-hidden="true" />
                </button>
            )}

            <Offcanvas
                isOpen={isOpen}
                toggle={toggle}
                direction="start"
                className="sb-offcanvas"
                backdropClassName="sb-backdrop"
                scrollable
            >
                <OffcanvasHeader toggle={toggle} className="sb-header" close={
                    <button type="button" className="sb-close-btn" onClick={toggle} aria-label="Tutup menu navigasi">
                        &times;
                    </button>
                }>
                    <div className="sb-brand">
                        <span className="sb-brand__eyebrow">SISTEM</span>
                        <span className="sb-brand__title">Manajemen Mesin Printer</span>
                    </div>
                </OffcanvasHeader>

                <OffcanvasBody className="sb-body">
                    <Nav vertical className="sb-nav">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavItem key={item.key} className="sb-nav__item">
                                    <RouterNavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `sb-nav__link${isActive ? ' is-active' : ''}`
                                        }
                                        onClick={close}
                                    >
                                        <Icon size={18} strokeWidth={2} className="sb-nav__icon" aria-hidden="true" />
                                        <span className="sb-nav__label">{item.label}</span>
                                        <ChevronRight size={14} className="sb-nav__chevron" aria-hidden="true" />
                                    </RouterNavLink>
                                </NavItem>
                            );
                        })}
                    </Nav>

                    <div className="sb-footer">
                        <div className="sb-avatar" aria-hidden="true">{DUMMY_USER.avatarInitial}</div>
                        <div className="sb-user">
                            <span className="sb-user__name">{DUMMY_USER.name}</span>
                            <span className="sb-user__role">{DUMMY_USER.role}</span>
                        </div>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </>
    );
}

Sidebar.propTypes = {
    /** Key menu yang sedang aktif, contoh: 'dashboard' */
    activeKey: PropTypes.string,
    /** Callback dipanggil saat item menu diklik: (key, href) => void */
    onNavigate: PropTypes.func,
};

Sidebar.defaultProps = {
    activeKey: 'spare_part_toner',
    onNavigate: undefined,
};