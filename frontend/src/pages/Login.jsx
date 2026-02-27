import React, { useState, useEffect } from 'react';
import { login, googleOAuthLogin } from '../services/api';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');
        const errorMsg = query.get('error');

        if (token) {
            localStorage.setItem('user_token', token);
            window.location.href = '/dashboard';
        } else if (errorMsg) {
            if (errorMsg === 'Admin_Google_Forbidden') {
                setError('Les administrateurs doivent se connecter via la page admin avec leur email.');
            } else {
                setError('Échec de la connexion : ' + errorMsg);
            }
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login({ email, password });
            localStorage.setItem('user_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/dashboard';
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Identifiants invalides. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/api/auth/google';
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card animate-fadeInUp">
                    <div className="login-header">
                        <div className="login-logo">
                            <img src="/logo.png" alt="Cabinet Hannit" style={{ width: '60px', height: '60px' }} />
                        </div>
                        <h2>Connexion</h2>
                        <p>Accédez à votre espace patient</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group animate-fadeInUp animate-delay-100">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="votre@email.com"
                            />
                        </div>
                        <div className="form-group animate-fadeInUp animate-delay-100">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block animate-fadeInUp animate-delay-100" style={{ width: '100%', height: '52px' }} disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-small" style={{ marginRight: '10px' }}></span>
                                    Connexion en cours...
                                </>
                            ) : 'Se connecter'}
                        </button>
                    </form>

                    <div className="login-divider animate-fadeInUp animate-delay-100">
                        <span>OU</span>
                    </div>

                    <button onClick={handleGoogleLogin} className="google-btn animate-fadeInUp animate-delay-100" style={{ width: '100%' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuer avec Google
                    </button>

                    <div className="login-footer animate-fadeInUp animate-delay-100">
                        Pas encore de compte ? <a href="/inscription">Inscrivez-vous</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
