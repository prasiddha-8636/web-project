import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        original.headers.Authorization = `Bearer ${token}`
                        return api(original)
                    })
                    .catch((err) => Promise.reject(err))
            }

            original._retry = true
            isRefreshing = true

            const refresh = localStorage.getItem('refresh')
            if (!refresh) {
                isRefreshing = false
                window.dispatchEvent(new Event('auth:logout'))
                return Promise.reject(error)
            }

            try {
                const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
                localStorage.setItem('access', data.access)
                localStorage.setItem('refresh', data.refresh)
                api.defaults.headers.Authorization = `Bearer ${data.access}`
                processQueue(null, data.access)
                original.headers.Authorization = `Bearer ${data.access}`
                return api(original)
            } catch (err) {
                processQueue(err, null)
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                window.dispatchEvent(new Event('auth:logout'))
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api
