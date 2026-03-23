import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)
        try {
            await register(formData.username, formData.email, formData.password, formData.password2)
            navigate('/')
        } catch (err) {
            setErrors(err.response?.data || { detail: 'Registration failed' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join DevTrack to manage your projects efficiently</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {errors.detail && <div className="form-error-banner">{errors.detail}</div>}

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            name="username"
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <span className="form-error">{errors.username[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <span className="form-error">{errors.email[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className="form-error">{errors.password[0]}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            name="password2"
                            type="password"
                            className="form-input"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                        />
                        {errors.password2 && <span className="form-error">{errors.password2[0]}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? <div className="spinner" /> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link title="Login" to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    )
}
