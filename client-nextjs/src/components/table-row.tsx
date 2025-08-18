import { TickerStreamData } from '../types/types'

interface TableRowProps {
    data: TickerStreamData
}

export function TableRow({ data }: TableRowProps) {
    return (
        <tr>
            <td>{data.type}</td>
            <td>{data.code}</td>
            <td>{data.opening_price}</td>
            <td>{data.high_price}</td>
            <td>{data.low_price}</td>
            <td>{data.trade_price}</td>
            <td>{data.prev_closing_price}</td>
            <td>{data.acc_trade_price}</td>
            <td>{data.change}</td>
            <td>{data.change_price}</td>
            <td>{data.signed_change_price}</td>
            <td>{data.change_rate}</td>
            <td>{data.signed_change_rate}</td>
            <td>{data.ask_bid}</td>
            <td>{data.trade_volume}</td>
            <td>{data.acc_trade_volume}</td>
            <td>{data.trade_date}</td>
            <td>{data.trade_time}</td>
            <td>{data.trade_timestamp}</td>
            <td>{data.acc_ask_volume}</td>
            <td>{data.acc_bid_volume}</td>
            <td>{data.highest_52_week_price}</td>
            <td>{data.highest_52_week_date}</td>
            <td>{data.lowest_52_week_price}</td>
            <td>{data.lowest_52_week_date}</td>
            <td>{data.market_state}</td>
            <td>{data.is_trading_suspended}</td>
            <td>{data.delisting_date}</td>
            <td>{data.market_warning}</td>
            <td>{data.timestamp}</td>
            <td>{data.acc_trade_price_24h}</td>
            <td>{data.acc_trade_volume_24h}</td>
            <td>{data.stream_type}</td>
        </tr>
    )
}
