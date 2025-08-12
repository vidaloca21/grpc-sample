// import { TickerServiceClient } from "@/proto/generated/TickerServiceClientPb";
// import * as tickerPb from "@proto/generated/ticker_pb";

// const client = new TickerServiceClient("http://localhost:8099");

// export const getTicker = () => {
//   const req = new tickerPb.TickerRequest();
//   req.setMarket("KRW-DOGE");

//   client.getTicker(req, {}, (err, res) => {
//     if (err) {
//       console.log(err.message);
//       return;
//     }

//     console.log(res);
//   });
// };

// import {
//   TickerServiceClientImpl,
//   TickerRequest,
//   StreamRequest,
//   StreamResponse,
// } from "@proto/ticker";
// import type { Observable } from "rxjs";

// const client = new TickerServiceClientImpl({ host: "http://localhost:8099" });

// export async function getTicker(market: string) {
//   const req: TickerRequest = { market };
//   const res = await client.getTicker(req);
//   return res; // TickerResponse
// }

// export function streamTicker(code: string): Observable<StreamResponse> {
//   const req: StreamRequest = { type: "ticker", code };
//   return client.streamTicker(req); // Observable<StreamResponse>
// }
