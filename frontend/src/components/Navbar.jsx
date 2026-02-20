import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar - Professional responsive navigation with glassmorphism
 */
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Load user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        window.location.href = '/connexion';
    };

    const navLinks = [
        { path: '/', label: 'Accueil' },
        { path: '/a-propos', label: 'À propos' },
        { path: '/services', label: 'Services' },
        { path: '/equipe', label: 'Équipe' },
        { path: '/contact', label: 'Contact' },
    ];

    const isAdmin = location.pathname.startsWith('/admin');
    if (isAdmin) return null; // Hide navbar on admin pages

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">

                <Link to="/" className="navbar-logo" id="navbar-logo">
                    <div className="logo-icon">
                        <img src="/logo.png" alt="Cabinet Hannit Logo" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">Cabinet Hannit</span>
                        <span className="logo-tagline">Kinésithérapie</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <ul className="navbar-links">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA Button + Phone */}
                <div className="navbar-actions">
                    {user && user.auth_provider === 'google' && (
                        <div className="google-badge" title="Connecté via Google">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Google</span>
                        </div>
                    )}

                    {user ? (
                        <button onClick={handleLogout} className="btn btn-secondary nav-cta">
                            Déconnexion
                        </button>
                    ) : (
                        <Link to="/connexion" className="btn btn-secondary nav-cta">
                            Connexion
                        </Link>
                    )}

                    <Link to="/rendez-vous" className="btn btn-primary nav-cta" id="nav-appointment-btn">
                        Rendez-vous
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    id="mobile-menu-toggle"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <ul className="mobile-links">
                    {navLinks.map((link, i) => (
                        <li key={link.path} style={{ animationDelay: `${i * 0.05}s` }}>
                            <Link
                                to={link.path}
                                className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {user ? (
                        <li style={{ animationDelay: '0.25s' }}>
                            <button onClick={handleLogout} className="btn btn-secondary mobile-cta" style={{ marginBottom: '10px', width: '100%' }}>
                                Déconnexion
                            </button>
                        </li>
                    ) : (
                        <li style={{ animationDelay: '0.25s' }}>
                            <Link to="/connexion" className="btn btn-secondary mobile-cta" style={{ marginBottom: '10px' }}>
                                Connexion
                            </Link>
                        </li>
                    )}
                    <li style={{ animationDelay: '0.3s' }}>
                        <Link to="/rendez-vous" className="btn btn-primary mobile-cta">
                            Prendre Rendez-vous
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Mobile Overlay */}
            {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
        </nav>
    );
};

export default Navbar;
