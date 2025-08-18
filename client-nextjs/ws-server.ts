import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { grpcClient } from './src/lib/grpc-client'
import type { StreamResponse } from './src/proto/ticker'

const PORT = 3001
const httpServer = createServer()
const wss = new WebSocketServer({ server: httpServer })

/** 연결된 클라이언트 집합 */
const clients = new Set<WebSocket>()

/** 헬스체크(죽은 커넥션 정리) */
function heartbeat() {
    ;(this as any).isAlive = true
}

wss.on('connection', ws => {
    ;(ws as any).isAlive = true
    ws.on('pong', heartbeat)

    clients.add(ws)
    console.log('client connected. total:', clients.size)

    ws.on('close', () => {
        clients.delete(ws)
        console.log('client disconnected. total:', clients.size)
    })

    ws.on('error', () => {
        clients.delete(ws)
    })

    // (선택) 클라에서 구독 파라미터 받기 (예: {type:'ticker', code:'KRW-BTC'})
    ws.on('message', buf => {
        try {
            const msg = JSON.parse(buf.toString())
            console.log('client message:', msg)
            // 여기서 per-socket 구독 로직을 구현하려면
            // (1) socket에 구독 상태 저장
            // (2) gRPC를 종합 구독 후 필터링해서 해당 소켓에만 send
        } catch {
            // 텍스트면 그대로 에코 등
        }
    })
})

/** 주기적으로 죽은 커넥션 정리 */
const interval = setInterval(() => {
    for (const ws of clients) {
        // @ts-ignore
        if ((ws as any).isAlive === false) {
            ws.terminate()
            clients.delete(ws)
            continue
        }
        // @ts-ignore
        ;(ws as any).isAlive = false
        ws.ping()
    }
}, 30000)

/** 브로드캐스트 유틸 */
function broadcast(json: any) {
    const payload = typeof json === 'string' ? json : JSON.stringify(json)
    for (const ws of clients) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload)
        }
    }
}

/** gRPC 스트림 단일 인스턴스 유지 + 자동 재연결 */
let started = false
let backoffMs = 1000

function startGrpcStream() {
    if (started) return
    started = true
    console.log('[gRPC] start streamTicker')

    const req = { type: 'ticker', code: 'KRW-BTC' } // 필요 시 코드/타입 바꿔도 됨
    const stream = grpcClient.streamTicker(req)

    stream.on('data', (data: StreamResponse) => {
        // NOTE: ts-proto면 data는 객체. @grpc/grpc-js + proto-loader라면 plain object일 수도.
        // 직렬화 비용 줄이려고 한 번만 stringify
        // 필터링/가공이 필요하면 여기서 처리
        broadcast(data)
    })

    stream.on('error', (err: any) => {
        console.error('[gRPC] stream error:', err?.code ?? '', err?.details ?? err)
        retry()
    })

    stream.on('end', () => {
        console.warn('[gRPC] stream ended')
        retry()
    })

    function retry() {
        started = false
        // 백오프(최대 30s)
        const wait = Math.min(backoffMs, 30000)
        console.log(`[gRPC] retry in ${wait}ms`)
        setTimeout(() => {
            backoffMs = Math.min(backoffMs * 2, 30000)
            startGrpcStream()
        }, wait)
    }
}

// 서버 시작
httpServer.listen(PORT, () => {
    console.log(`ws server listening on ws://localhost:${PORT}`)
    startGrpcStream() // 서버 뜰 때 gRPC 스트림도 시작
})

// 종료 처리
process.on('SIGINT', () => {
    clearInterval(interval)
    httpServer.close(() => process.exit(0))
})
