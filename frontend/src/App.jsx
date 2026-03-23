import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectPage from './pages/ProjectPage'
import TaskDetailPage from './pages/TaskDetailPage'

function PrivateRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return null
    return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return null
    return !user ? children : <Navigate to="/" replace />
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                    <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                    <Route path="/projects/:id" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />
                    <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
