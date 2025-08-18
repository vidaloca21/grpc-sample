'use client'

import { StreamTable } from '@/components'
import { TickerStreamData } from '@/types/types'
import { useEffect, useRef, useState } from 'react'

export function StreamView() {
    const [data, setData] = useState<TickerStreamData[]>([])
    const wsRef = useRef<WebSocket | null>(null)

    /** 연결 */
    const connect = () => {
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
            console.log('ws already connected')
            return
        }

        const ws = new WebSocket('ws://localhost:3001')
        wsRef.current = ws

        ws.onopen = () => console.log('ws connected')
        ws.onclose = () => console.log('ws disconnected')
        ws.onerror = e => console.error('ws error', e)

        ws.onmessage = ev => {
            const recv = decodeTicker(ev.data as string)
            if (!recv) return
            setData(prev => {
                const next = [...prev, recv]
                if (next.length > 500) next.shift() // 옵션
                return next
            })
        }
    }

    /** 해제 */
    const disconnect = () => {
        if (wsRef.current) {
            console.log('ws closing...')
            wsRef.current.close()
            wsRef.current = null
        }
    }

    /** 컴포넌트 언마운트 시 자동 정리 */
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])

    return (
        <div>
            <h3>stream ticker (ws)</h3>
            <button onClick={connect}>연결</button>
            <button onClick={disconnect}>해제</button>

            <StreamTable data={data.reverse()} />
        </div>
    )
}

function decodeTicker(raw: string): TickerStreamData | null {
    try {
        const first = JSON.parse(raw) // 1차 파싱
        if (typeof first === 'string') {
            return JSON.parse(first) // 문자열이면 한 번 더
        }
        if (first && typeof first === 'object') {
            if (typeof first.message === 'string') {
                return JSON.parse(first.message) // { message: "..." } 형태
            }
            return first as TickerStreamData // 이미 객체
        }
    } catch {}
    return null
}
