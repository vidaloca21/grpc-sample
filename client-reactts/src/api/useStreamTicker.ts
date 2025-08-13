// src/features/ticker/useStreamTicker.ts
import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { tickerClient } from './config/ticker-client'

const key = (p: { type: string; code: string }) => ['streamTicker', p.type, p.code]

export function useStreamTicker(params: { type: string; code: string }) {
    const qc = useQueryClient()

    const q = useQuery({
        queryKey: key(params),
        queryFn: async () => [] as { message: string }[],
        staleTime: Infinity,
        gcTime: 0,
        enabled: false,
    })

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const it = tickerClient.streamTicker(params) // async iterable
                for await (const msg of it) {
                    if (cancelled) break
                    qc.setQueryData<{ message: string }[]>(key(params), (prev = []) => [...prev, msg])
                }
            } catch (e) {
                console.log(e) // 필요시 에러 상태 반영
            }
        })()
        return () => {
            cancelled = true
        }
    }, [params.type, params.code, qc])

    return q
}
