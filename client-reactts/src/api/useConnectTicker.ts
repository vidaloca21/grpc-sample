import { useQuery } from '@connectrpc/connect-query'
import { getTicker } from '../proto/gen/ticker-TickerService_connectquery'

export function useConnectTicker(market: string) {
    return useQuery(getTicker, { market }, { enabled: false })
}
