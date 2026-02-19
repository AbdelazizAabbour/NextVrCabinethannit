import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(formData);
            localStorage.setItem('user_token', response.data.token);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
            // Redirect to home or a success page
            window.location.href = '/';
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response) {
                // The server responded with a status code outside the range of 2xx
                if (err.response.status === 422 && err.response.data?.errors) {
                    const firstError = Object.values(err.response.data.errors)[0][0];
                    setError(firstError);
                } else if (err.response.status === 500) {
                    setError('Erreur serveur (500). Veuillez vérifier que votre base de données est bien configurée et accessible.');
                } else {
                    setError(`Une erreur est survenue (${err.response.status}). Veuillez réessayer.`);
                }
            } else if (err.request) {
                // The request was made but no response was received
                setError('Impossible de contacter le serveur. Veuillez vérifier que le backend est bien lancé.');
            } else {
                // Something happened in setting up the request
                setError('Une erreur est survenue lors de l\'inscription.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-card animate-fadeInUp">
                    <div className="register-header">
                        <div className="cabinet-logo">
                            <img src="/logo.png" alt="Cabinet Hannit" style={{ width: '60px', height: '60px' }} />
                        </div>
                        <h2>Créer un compte</h2>
                        <p>Inscrivez-vous pour un suivi personnalisé</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleRegister} className="register-form">
                        <div className="form-group">
                            <label htmlFor="name">Nom complet</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Votre nom"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="votre@email.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                className="form-input"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" style={{ width: '100%' }} className="btn btn-primary btn-block animate-fadeInUp animate-delay-100" disabled={loading}>
                            {loading ? 'Inscription...' : 'S\'inscrire'}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>Déjà un compte ? <Link to="/admin/login">Connectez-vous ici</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
