import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

const PROTO_PATH = path.resolve(process.cwd(), 'src/proto/ticker.proto')
const PROTO_OPTION = {
    keepCase: true,
    long: String,
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, PROTO_OPTION)
const proto = grpc.loadPackageDefinition(packageDefinition) as any
const grpcClient = new proto.TickerService('localhost:10010', grpc.credentials.createInsecure())

export { grpcClient }
