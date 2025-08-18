'use client'

import { TickerResponse } from '@/proto/ticker'
import { useState } from 'react'

export function TickerView() {
    const [code, setCode] = useState<string>('')
    const [data, setData] = useState<TickerResponse>()
    const getTicker = () => {
        fetch('/api/getTicker?code=' + code)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err))
    }

    return (
        <div>
            <h3>unary ticker 호출</h3>
            <select value={code} onChange={e => setCode(e.target.value)}>
                <option value="KRW-BTC">KRW-BTC</option>
                <option value="KRW-ETH">KRW-ETH</option>
                <option value="KRW-DOGE">KRW-DOGE</option>
            </select>
            <button onClick={getTicker}>호출</button>
            <table>
                <tbody>
                    <tr>
                        <th>market</th>
                        <td>{data?.market}</td>
                    </tr>
                    <tr>
                        <th>opening_price</th>
                        <td>{data?.opening_price}</td>
                    </tr>
                    <tr>
                        <th>high_price</th>
                        <td>{data?.high_price}</td>
                    </tr>
                    <tr>
                        <th>low_price</th>
                        <td>{data?.low_price}</td>
                    </tr>
                    <tr>
                        <th>trade_price</th>
                        <td>{data?.trade_price}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
