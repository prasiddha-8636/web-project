import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const logout = useCallback(async (skipRequest = false) => {
        if (!skipRequest) {
            try {
                const refresh = localStorage.getItem('refresh')
                if (refresh) await api.post('/auth/logout/', { refresh })
            } catch { }
        }
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        setUser(null)
    }, [])

    useEffect(() => {
        const handler = () => logout(true)
        window.addEventListener('auth:logout', handler)
        return () => window.removeEventListener('auth:logout', handler)
    }, [logout])

    useEffect(() => {
        const token = localStorage.getItem('access')
        if (!token) {
            setLoading(false)
            return
        }
        api.get('/auth/me/')
            .then(({ data }) => setUser(data))
            .catch(() => {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
            })
            .finally(() => setLoading(false))
    }, [])

    const login = async (username, password) => {
        const { data } = await api.post('/auth/login/', { username, password })
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        const me = await api.get('/auth/me/')
        setUser(me.data)
    }

    const register = async (username, email, password, password2) => {
        const { data } = await api.post('/auth/register/', { username, email, password, password2 })
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        setUser(data.user)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
