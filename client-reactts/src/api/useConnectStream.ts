import { useEffect, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { Code, ConnectError, createClient } from '@connectrpc/connect'
import { StreamRequest, StreamResponse, TickerService } from '../proto/gen/ticker_pb'

const transport = createGrpcWebTransport({ baseUrl: 'http://localhost:8099' })
const client = createClient(TickerService, transport) // createClient가 아니라 createPromiseClient 권장

const key = (p: { type: string; code: string }) => ['streamTicker', p.type, p.code]
const ABORT_MESSAGE = 'client abort'

export function useConnectStream(params: { type: string; code: string }) {
    const qc = useQueryClient()
    const abortRef = useRef<AbortController | null>(null)
    const runningRef = useRef(false)

    // React Query에 “스트림 버퍼” 자리를 마련
    const q = useQuery<StreamResponse[]>({
        queryKey: key(params),
        queryFn: async () => [],
        staleTime: Infinity,
        gcTime: Infinity,
        enabled: true, // 자동 refetch 비활성화
    })

    // unmount시 안전 종료
    useEffect(() => {
        return abortRef.current?.abort(ABORT_MESSAGE)
    }, [])

    const connect = async () => {
        if (runningRef.current) return //이미 실행 중이면 무시
        const ac = new AbortController()
        abortRef.current = ac
        runningRef.current = true

        try {
            //const req = new StreamRequest({ type: params.type, code: params.code })
            const iter = client.streamTicker(params, { signal: ac.signal })
            for await (const msg of iter) {
                qc.setQueryData<StreamResponse[]>(key(params), (prev = []) => [...prev, msg])
            }
        } catch (err) {
            if (err instanceof ConnectError && err.code === Code.Canceled) {
                console.log('stream cancelled')
            } else if ((err as any)?.name === 'AbortError') {
                console.log('stream aborted')
            } else {
                console.log('stream error: ', err)
            }
        } finally {
            runningRef.current = false
        }
    }

    const disConnect = () => {
        abortRef.current?.abort(ABORT_MESSAGE)
        abortRef.current = null
    }

    const clear = () => {
        qc.setQueryData(key(params), [] as StreamResponse[])
    }

    return useMemo(
        () => ({
            data: q.data ?? [],
            connect,
            disConnect,
            clear,
            isStreaming: runningRef.current,
        }),
        [q.data],
    )
}
