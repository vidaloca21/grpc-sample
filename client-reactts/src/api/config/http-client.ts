import axios from 'axios'

export const httpClient = axios.create({
    baseURL: 'http://localhost:8099', // REST 백엔드 베이스 URL
    timeout: 10_000,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 공통 토큰 주입 (있다면)
httpClient.interceptors.request.use(config => {
    // const token = authStore.getState().token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
})

// 에러 정규화
export class HttpError extends Error {
    status?: number
    data?: unknown
    constructor(message: string, status?: number, data?: unknown) {
        super(message)
        this.status = status
        this.data = data
    }
}

httpClient.interceptors.response.use(
    res => res,
    err => {
        const status = err?.response?.status
        const data = err?.response?.data
        const message = data?.message ?? err?.message ?? `HTTP Error${status ? ` (${status})` : ''}`
        return Promise.reject(new HttpError(message, status, data))
    },
)
