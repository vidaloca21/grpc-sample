// import { WebSocket } from 'ws'
// import { grpcClient } from './grpc-client'

// let wsClients: WebSocket[] = []

// export function addWsClient(ws: WebSocket) {
//     wsClients.push(ws)
//     ws.on('close', () => {
//         wsClients = wsClients.filter(client => client !== ws)
//     })
// }

// export function startStreamTicker() {
//     const stream = grpcClient.streamTicker({ code: 'KRW-BTC', type: 'ticker' })

//     stream.on('data', (data: string) => {
//         const payload = JSON.stringify(data)
//         wsClients.forEach(ws => {
//             if (ws.readyState === WebSocket.OPEN) {
//                 ws.send(payload)
//             }
//         })
//     })

//     stream.on('error', (err: any) => {
//         console.error('Stream error:', err)
//     })

//     stream.on('end', () => {
//         console.log('Stream ended')
//     })
// }
