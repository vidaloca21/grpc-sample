import { useEffect, useState } from 'react'
import { getTicker, startTickerStream } from './api/api'
import './App.css'

export default function App() {
    const [marketInput, setMarketInput] = useState('KRW-BTC')
    const [messages, setMessages] = useState([])
    const [running, setRunning] = useState(false)

    const callApi = () => {
        getTicker(marketInput).then(res => console.log(res))
    }
    const callStream = () => {
        setRunning(!running)
    }
    useEffect(() => {
        if (!running) return
        const stop = startTickerStream({
            type: 'ticker',
            code: 'KRW-DOGE',
            onData: obj => setMessages(prev => [...prev, obj?.message ?? JSON.stringify(obj)]),
            onError: e => {
                console.error('stream error:', e)
                setRunning(false)
            },
            onEnd: () => {
                console.log('stream end')
                setRunning(false)
            },
        })
        return () => stop()
    }, [running])

    return (
        <div>
            <div>
                <h3>getTicker 호출</h3>
                <select value={marketInput} onChange={e => setMarketInput(e.target.value)}>
                    <option value="KRW-BTC">KRW-BTC</option>
                    <option value="KRW-ETH">KRW-ETH</option>
                    <option value="KRW-DOGE">KRW-DOGE</option>
                </select>
                <button onClick={callApi}>호출</button>
            </div>
            <div>
                <h3>streamTicker 호출</h3>
                <button onClick={callStream}>{running ? '중지' : '시작'}</button>
                <div>
                    <h4>stream results</h4>
                    <ul>
                        {messages.map((m, i) => (
                            <li key={i}>{m}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
