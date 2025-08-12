import gen from '@proto/generated'

const TickerServiceClient = gen.TickerServiceClient
const TickerRequest = gen.TickerRequest
const StreamRequest = gen.StreamRequest

const client = new TickerServiceClient('http://localhost:8099', null, null)

export async function getTicker(market) {
    const req = new TickerRequest()
    req.setMarket(market)
    return new Promise((resolve, reject) => {
        client.getTicker(req, {}, (err, res) => {
            if (err) reject(err)
            else resolve(res.toObject())
        })
    })
}

export function startTickerStream({ type, code, onData, onError, onEnd }) {
    const req = new StreamRequest()
    req.setCode(code)
    req.setType(type)

    const stream = client.streamTicker(req)
    stream.on('data', res => {
        onData?.(res.toObject ? res.toObject() : { message: res.getMessage?.() })
    })
    stream.on('error', err => onError?.(err))
    stream.on('end', () => onEnd?.())

    // 컴포넌트 unmount 혹은 중지 버튼에서 호출
    return () => stream.cancel()
}
