import { useEffect, useState } from 'react'
import { useStreamTicker, useGetTicker, useConnectStream, useConnectTicker } from './api'
import type { TickerResponse, StreamResponse } from './proto/gen/ticker_pb'
import './App.css'

export default function App() {
    const [market, setMarket] = useState<string>('KRW-BTC')
    const [messages, setMessages] = useState<StreamResponse[]>([])
    const [tickerResponse, setTickerResponse] = useState<string>()
    const { refetch: fetchTicker } = useGetTicker(market)
    const onClickBtn = () => {
        fetchTicker().then(res => console.log(res.data))
    }

    // const params = { type: 'ticker', code: marketInput }
    // const { refetch: fetchStream } = useStreamTicker(params)
    // const callStream = () => {
    //     fetchStream().then(message => console.log(message))
    // }
    // const { data: streamMsgs = [] } = useStreamTicker(params)
    // const callStream = () => {
    // console.log(streamMsgs)
    // }

    const { refetch: fetchConnect } = useConnectTicker(market)
    const callConnectTicker = () => {
        fetchConnect().then(res => setTickerResponse(JSON.stringify(res.data)))
    }

    const params = { type: 'ticker', code: market }
    const { connect, disConnect, clear, data } = useConnectStream(params)

    useEffect(() => {
        console.log(data)
        setMessages(data)
    }, [data])

    return (
        <>
            <div>
                <h3>getTicker 호출</h3>
                <select value={market} onChange={e => setMarket(e.target.value)}>
                    <option value="KRW-BTC">KRW-BTC</option>
                    <option value="KRW-ETH">KRW-ETH</option>
                    <option value="KRW-DOGE">KRW-DOGE</option>
                </select>
                <button onClick={onClickBtn}>react-query 호출</button>
            </div>
            <div>
                <h3>streamTicker 호출</h3>
                {/* <button onClick={callStream}>호출</button> */}
                <div>
                    <h4>stream results</h4>
                    <ul></ul>
                </div>
            </div>
            <div>
                <h3>connect-ticker 호출</h3>
                <button onClick={callConnectTicker}>호출</button>
                <div>결과: {tickerResponse}</div>
            </div>
            <div>
                <h3>connect-stream</h3>
                <button onClick={connect}>연결</button>
                <button onClick={disConnect}>해제</button>
                <button onClick={clear}>버퍼 비우기</button>
                <div>
                    <h4>stream results</h4>
                    <ul>
                        {messages.map((data, idx) => (
                            <li key={idx}>{data.message}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
