import { createClient, Interceptor } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { TickerService } from '../../proto/gen/ticker_pb'

// 공통 헤더(토큰 등) 삽입 인터셉터
const authInterceptor: Interceptor = next => async req => {
    // const token = authStore.getState().token;
    // if (token) req.header.set('Authorization', `Bearer ${token}`);
    return await next(req)
}

export const transport = createGrpcWebTransport({
    baseUrl: 'http://localhost:8099',
    interceptors: [authInterceptor],
})

// Create the client using the generated service definition and the transport
export const tickerClient = createClient(TickerService, transport)
