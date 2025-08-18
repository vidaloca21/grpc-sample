import { TableRow } from './table-row'
import { TickerStreamData } from '../types/types'

interface StreamTableProps {
    data: TickerStreamData[]
}

export function StreamTable({ data }: StreamTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <td>type</td>
                    <td>code</td>
                    <td>opening_price</td>
                    <td>high_price</td>
                    <td>low_price</td>
                    <td>trade_price</td>
                    <td>prev_closing_price</td>
                    <td>acc_trade_price</td>
                    <td>change</td>
                    <td>change_price</td>
                    <td>signed_change_price</td>
                    <td>change_rate</td>
                    <td>signed_change_rate</td>
                    <td>ask_bid</td>
                    <td>trade_volume</td>
                    <td>acc_trade_volume</td>
                    <td>trade_date</td>
                    <td>trade_time</td>
                    <td>trade_timestamp</td>
                    <td>acc_ask_volume</td>
                    <td>acc_bid_volume</td>
                    <td>highest_52_week_price</td>
                    <td>highest_52_week_date</td>
                    <td>lowest_52_week_price</td>
                    <td>lowest_52_week_date</td>
                    <td>market_state</td>
                    <td>is_trading_suspended</td>
                    <td>delisting_date</td>
                    <td>market_warning</td>
                    <td>timestamp</td>
                    <td>acc_trade_price_24h</td>
                    <td>acc_trade_volume_24h</td>
                    <td>stream_type</td>
                </tr>
            </thead>
            <tbody>{data && data.map((d: TickerStreamData, i: number) => <TableRow key={i} data={d} />)}</tbody>
        </table>
    )
}
