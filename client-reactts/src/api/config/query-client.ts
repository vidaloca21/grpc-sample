import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 0,
        },
    },
})
