const pb = require('./ticker_pb.cjs')
const svc = require('./ticker_grpc_web_pb.cjs')

exports.TickerRequest = pb.TickerRequest
exports.TickerResponse = pb.TickerResponse
exports.StreamRequest = pb.StreamRequest
exports.StreamResponse = pb.StreamResponse

exports.TickerServiceClient = svc.TickerServiceClient
exports.TickerServicePromiseClient = svc.TickerServicePromiseClient
