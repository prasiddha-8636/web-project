import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">DT</span>
                    <span className="brand-name">DevTrack</span>
                </Link>

                <div className="navbar-actions">
                    <div className="user-info">
                        <span className="user-name">{user?.username}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    )
}
