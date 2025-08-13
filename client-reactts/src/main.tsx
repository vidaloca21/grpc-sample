import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { queryClient } from './api/index.ts'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { TransportProvider } from '@connectrpc/connect-query'

const transport = createGrpcWebTransport({ baseUrl: 'http://localhost:8099' })

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TransportProvider transport={transport}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </TransportProvider>
    </StrictMode>,
)
