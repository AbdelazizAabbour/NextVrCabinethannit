import React, { useState, useEffect } from 'react';
import { getDashboardData, toggleServiceSelection } from '../services/api';
import './UserDashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await getDashboardData();
                setData(response.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                const detailedError = err.response?.data?.error || err.response?.data?.message || "";
                setError("Impossible de charger les données du tableau de bord. " + detailedError);
                if (err.response && err.response.status === 401) {
                    navigate('/connexion');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="user-dashboard">
                <div className="dashboard-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
                    <p>Chargement de votre espace personnel...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-dashboard">
                <div className="dashboard-container">
                    <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--primary)', padding: '40px' }}>
                        <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Oups !</h2>
                        <div className="error-box" style={{ background: '#fff1f2', color: '#be123c', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fda4af' }}>
                            {error}
                        </div>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { user, appointments, messages, selections, stats } = data;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'appointments':
                return (
                    <div className="data-table-container">
                        {appointments.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Date</th>
                                        <th>Heure</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => (
                                        <tr key={app.id}>
                                            <td>{app.service || 'N/A'}</td>
                                            <td>{new Date(app.date).toLocaleDateString('fr-FR')}</td>
                                            <td>{app.time || '--:--'}</td>
                                            <td>
                                                <span className={`status-badge status-${app.status}`}>
                                                    {app.status === 'pending' ? 'En attente' :
                                                        app.status === 'confirmed' ? 'Confirmé' :
                                                            app.status === 'cancelled' ? 'Annulé' : app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <h4>Aucun rendez-vous trouvé</h4>
                                <Link to="/rendez-vous" className="btn btn-primary">Prendre rendez-vous</Link>
                            </div>
                        )}
                    </div>
                );
            case 'messages':
                return (
                    <div className="data-table-container">
                        {messages.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Sujet</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(msg => (
                                        <tr key={msg.id}>
                                            <td style={{ fontWeight: 600 }}>{msg.subject}</td>
                                            <td style={{ maxWidth: '300px' }} className="text-truncate">{msg.message}</td>
                                            <td>{new Date(msg.created_at).toLocaleDateString('fr-FR')}</td>
                                            <td>
                                                <span className={`status-badge ${msg.is_read ? 'status-confirmed' : 'status-pending'}`}>
                                                    {msg.is_read ? 'Lu' : 'Non lu'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <h4>Aucun message envoyé</h4>
                                <Link to="/contact" className="btn btn-primary">Nous contacter</Link>
                            </div>
                        )}
                    </div>
                );
            case 'selections':
                return (
                    <div className="selections-grid">
                        {selections.length > 0 ? (
                            selections.map(service => (
                                <div key={service.id} className="selection-card">
                                    <h4>{service.title}</h4>
                                    <p>{service.description}</p>
                                    <div className="card-actions">
                                        <Link to={`/services`} className="btn-text">Détails</Link>
                                        <button
                                            onClick={async () => {
                                                await toggleServiceSelection(service.id);
                                                // Refresh data
                                                const res = await getDashboardData();
                                                setData(res.data);
                                            }}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <h4>Vous n'avez pas encore de services sélectionnés</h4>
                                <Link to="/services" className="btn btn-primary">Explorer les services</Link>
                            </div>
                        )}
                    </div>
                );
            default: // overview
                return (
                    <div className="overview-content">
                        <div className="welcome-section">
                            <h3>Bienvenue sur votre espace, {user.name} !</h3>
                            <p>Retrouvez ici l'historique de vos rendez-vous, vos messages et vos services préférés.</p>
                        </div>

                        <div className="overview-grid">
                            <div className="overview-card">
                                <div className="overview-card-header">
                                    <h4>Prochain Rendez-vous</h4>
                                    <Link to="#" onClick={() => setActiveTab('appointments')} className="view-all">Tout voir</Link>
                                </div>
                                <div className="overview-card-body">
                                    {appointments.length > 0 ? (
                                        <div className="featured-item">
                                            <div className="item-main">{appointments[0].service}</div>
                                            <div className="item-sub">
                                                {new Date(appointments[0].date).toLocaleDateString('fr-FR')} à {appointments[0].time}
                                            </div>
                                            <span className={`status-badge status-${appointments[0].status}`}>
                                                {appointments[0].status === 'pending' ? 'En attente' : 'Confirmé'}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="empty-text">Aucun rendez-vous à venir.</p>
                                    )}
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="overview-card-header">
                                    <h4>Dernier Message</h4>
                                    <Link to="#" onClick={() => setActiveTab('messages')} className="view-all">Tout voir</Link>
                                </div>
                                <div className="overview-card-body">
                                    {messages.length > 0 ? (
                                        <div className="featured-item">
                                            <div className="item-main">{messages[0].subject}</div>
                                            <div className="item-sub text-truncate" style={{ maxWidth: '200px' }}>
                                                {messages[0].message}
                                            </div>
                                            <div className="item-date">
                                                {new Date(messages[0].created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="empty-text">Aucun message envoyé.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions-bar">
                            <h4>Actions Rapides</h4>
                            <div className="action-buttons">
                                <Link to="/rendez-vous" className="btn btn-primary btn-sm">Nouveau Rendez-vous</Link>
                                <Link to="/services" className="btn btn-secondary btn-sm">Explorer les Services</Link>
                                <Link to="/contact" className="btn btn-white btn-sm">Nous Contacter</Link>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="user-dashboard animate-fadeInUp">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>Mon Tableau de Bord</h1>
                        <p>Espace patient de {user.name}</p>
                    </div>
                    <div className="user-profile-summary">
                        {user.auth_provider === 'google' && (
                            <div className="google-badge-dashboard">
                                <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Authentifié avec Google
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon icon-blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <div className="stat-info">
                            <h3>Rendez-vous</h3>
                            <div className="stat-value">{stats.total_appointments}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon icon-green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <div className="stat-info">
                            <h3>Messages</h3>
                            <div className="stat-value">{stats.total_messages}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon icon-purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <div className="stat-info">
                            <h3>Sélections</h3>
                            <div className="stat-value">{stats.total_selections}</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Aperçu
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        Mes Rendez-vous
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        Mes Messages
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'selections' ? 'active' : ''}`}
                        onClick={() => setActiveTab('selections')}
                    >
                        Mes Sélections
                    </button>
                </div>

                <div className="tab-content animate-fadeInUp">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
