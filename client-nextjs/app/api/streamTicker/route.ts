// // pages/api/socket.ts
// import { NextApiResponseWithSocket } from '@/types/next'
// import type { NextApiRequest } from 'next'
// import WebSocket, { WebSocketServer } from 'ws'
// import type { Server as HTTPServer } from 'http'

// let wss: WebSocketServer | undefined

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// }

// export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
//     if (!res.socket.server.wss) {
//         console.log('Starting WebSocket server...')
//         const httpServer = res.socket.server as HTTPServer
//         wss = new WebSocketServer({ server: httpServer })
//         res.socket.server.wss = wss

//         wss.on('connection', (socket: WebSocket) => {
//             console.log('Client connected')

//             socket.on('message', message => {
//                 console.log('Received:', message.toString())
//                 socket.send(`Echo: ${message}`)
//             })

//             socket.on('close', () => {
//                 console.log('Client disconnected')
//             })
//         })
//     }

//     res.end()
// }
