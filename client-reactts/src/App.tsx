import { useState } from 'react'
import { useStreamTicker, useTicker } from './api'
import './App.css'

export default function App() {
    const [marketInput, setMarketInput] = useState<string>('KRW-BTC')
    const { refetch: fetchTicker } = useTicker(marketInput)
    const onClickBtn = () => {
        fetchTicker().then(res => console.log(res.data))
    }

    const params = { type: 'ticker', code: marketInput }
    // const { refetch: fetchStream } = useStreamTicker(params)
    // const callStream = () => {
    //     fetchStream().then(message => console.log(message))
    // }
    const { data: streamMsgs = [] } = useStreamTicker(params)
    const callStream = () => {
        console.log(streamMsgs)
    }
    return (
        <>
            <div>
                <h3>getTicker 호출</h3>
                <select value={marketInput} onChange={e => setMarketInput(e.target.value)}>
                    <option value="KRW-BTC">KRW-BTC</option>
                    <option value="KRW-ETH">KRW-ETH</option>
                    <option value="KRW-DOGE">KRW-DOGE</option>
                </select>
                <button onClick={onClickBtn}>react-query 호출</button>
            </div>
            <div>
                <h3>streamTicker 호출</h3>
                <button onClick={callStream}>호출</button>
                <div>
                    <h4>stream results</h4>
                    <ul></ul>
                </div>
            </div>
        </>
    )
}
