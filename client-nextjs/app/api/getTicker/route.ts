import { grpcClient } from '@/lib'
import { TickerResponse } from '@/proto/ticker'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code') ?? 'KRW-BTC'

    return new Promise<NextResponse>((resolve, reject) => {
        grpcClient.getTicker({ market: code }, (error: any, response: TickerResponse) => {
            if (error) {
                return reject(NextResponse.json({ err: error.message }, { status: 500 }))
            }
            return resolve(NextResponse.json(response))
        })
    })
}
