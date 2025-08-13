import { useQuery } from '@tanstack/react-query'
import { tickerClient } from './config/ticker-client'

export function useTicker(market: string) {
    return useQuery({
        queryKey: ['ticker', market],
        queryFn: async () => {
            const res = await tickerClient.getTicker({ market })
            return res // TickerResponse
        },
        enabled: false,
    })
}
