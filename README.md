A // Java gRPC 서버
B // client gRPC 서버
C // client application > react
D // server application > upbit

#### 25.08.11
>>>> 지금까지 뭐 했냐면
1. protoc 설치함 (zip 파일 환경변수 등록)
2. docker 설치함
3. docer-compose.yml, envoy_d_grpcweb.yaml 작성함
4. docker에서 envoy proxy pull 땡겨옴
5. grpcurl 설치함 (zip 파일 환경변수 등록)
6. docker compose up으로 envoy proxy 이미지 띄움
7. grpcurl로 api 요청-응답 확인함


이제 해야되는거 순서대로 프로세스 >>>>>> 

1. envoy 프록시 설정해서 docker 이미지로 띄우기
cd D:\dev_workspace\ci-workspace\grpc\config
docker compose up -d envoy-grpcweb

2. envoy - 10010 (gRPC 서버) 연결 및 환경 설정 >> 여기까지 확인 완
grpcurl -plaintext -import-path "D:\dev_workspace\ci-workspace\grpc\grpc-server\src\main\proto\upbit" -proto "ticker.proto" -d "{\"market\":\"KRW-DOGE\"}" localhost:8099 TickerService/getTicker

3. vite - react 프로젝트 구성
>> proto 컴파일하고, 그거로 api 만들고, 호출부 작업하면 됨
>> 의존성 설치 
npm i grpc-web google-protobuf @types/google-protobuf
npm install google-protobuf grpc-web @types/google-protobuf
npm install protoc-gen-grpc-web

>> proto 컴파일
npx protoc --js_out=import_style=commonjs,binary:./src/generated --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/generated ./src/proto/ticker.proto
//// package.json에 추가
"scripts": { ...
  "codegen": "npx protoc --js_out=import_style=commonjs,binary:./src/generated --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/generated ./src/proto/ticker.proto"
}

4. 화면 - gRPC 테스트


##### 25.08.08
01. upbit와 통신하는 gRPC 서버 - java gradle project
이거 그냥 지금 만들어진거 잘 정리하면 됨
unary 하나랑 실시간이랑 해서 서버 코드 작성하면 될듯


procedure 경로 > api 경로 어케함? 02에서 api 경로 만들어서 01 호출하는거겟지

02. 화면과 통신하는 서버 - gRPC 클라이언트 - spring boot 혹은 nextjs
remote procedure 호출 // 데이터 송수신 확인 용도
근데 이제 여기서 실시간을 화면에 내려주기 위해서는
화면과도 HTTP2.0 연결 필요
(아니면은 데이터 websocket으로 내려야되는데, 이러면 의미 없는듯)


03. (필요에 따라) 화면 - 일단 화면은 react로 진행할건데 이제 grpc-web 관련 확인 필요
01 - 03 다이렉트로 호출하기 위해서는 grpc-web 관련 설정 필요
(브라우저에서 바로 grpc로 붙을 수가 없다고 함)






A 구현 > 이게 통신이 열려 있으려면 톰캣이든 부트든 붙여놔야 >> 톰캣, 부트 없어도 됨 >> gRPC에 Main 두고 돌리면 됨
	>> 업비트에서 실시간 받아오는 파트 >> java에서 그냥 쏘면 됨
	>> 받아온 실시간 데이터를 protobuf로 파싱하는 파트
	>> 파싱한 protobuf를 요청-응답으로 보내주는 파트
- client 요청을 받을 서버 게이트웨이 구현

근데 grpc가 뭔지는 아직인거 같은데
grpc 구성 요소는 지금
protobuf + http2.0 인거고
protobuf를 통해서 이기종, 다른 언어 간의 통신 제약을 없애겠다는 거고
// 다시말하면은 이제 개발 언어에 구애받지 않고 데이터를 주고받겠다는 거고
http2.0에 기반해서 4가지 요청-응답 방식을 지원하겠다는 거고
// http1.1에서 실시간은 socket에 의존했지만, http2.0에서는 서버 push, streaming 방식으로 가능

그러면 이제 보면은
1. gRPC 서버 (Java, gradle) >> upbit와 통신하는 서버 >> spring boot에 팔까 걍
- upbit 실시간으로 packet 송신
- upbit 실시간 수신 // string
- 수신한 패킷을 protobuf로 parsing // protobuf
- client 서버로부터 요청 수신 ( >> 여기가 이제 gRPC //client가 요청한 procedure를 실행 << )
- protobuf로 parsing한 데이터를 client에 응답

2. client 서버 ( 일단 Spring Boot, 추후 Node.js 확장 ) >> 브라우저와 통신하는 서버
- gRPC 서버에 데이터 요청 ( >> 여기가 이제 gRPC //server에 procedure 실행 요청 << )
- gRPC 서버에서 데이터 수신 (protobuf)
- 수신한 protobuf를 역직렬화(JSON으로 parsing)
- 역직렬화한 JSON data를 화면에 응답

3. client UI (React)
- client 서버에 데이터 요청 (JSON)
- client 서버에서 데이터 수신 (JSON)
- 수신한 데이터 화면 UI 처리


>> 1,2,3을 구현하면 client server - client 화면 얘네도 실시간 연결을 따로 해줘야되네
>> 걍 react가 바로 붙는게 나을지도?
>> 브라우저에서 gRPC 바로 사용하려면, grpc-web 같은 솔루션 필요
>> if next.js로 붙으면?

gRPC 서버
### 위 연결한거 바탕으로다가 서버 구현할 수 있을듯?
resource에다사 cert key, pem 넣어놓고 인증하네 - 

### TLS 연결 됨 25.08.05. 17시 ###
D:\dev_workspace\grpc\grpc-java-1.73.0\examples\example-tls
>> ../gradlew installDist
>> ./build/install/example-tls/bin/hello-world-tls-server 50440 ../../testing/src/main/resources/certs/server1.pem ../../testing/src/main/resources/certs/server1.key  
curl 연결 확인됨
postman에서 응답 돌아옴 > Content-Type 'stream' is not supported >>> content-type이 http1.1이랑 달라서, 찾아볼 필요 있음
>>>> Content-type: application/grpc

### 지금 막혀있는 부분 25.08.05 15시 ###
gradle로 서버 구동 후, postman에서 요청 보냈을 때, 아래 에러 메세지
HTTP/2 client preface string missing or corrupt. Hex dump for received bytes: 1603010200010001fc0303bfa4e6d4b3b8b8814855292bac
SSL/TLS 인증 관련인 듯 싶은데

### 고민 중 25.08.05. 13시 ###
>> HTTP2.0 기반이므로, SSL 인증이 필수임 > 설정해야 할 항목이 몇 가지 있을 것
https://velog.io/@jakeseo_me/RPC%EB%9E%80

### 고민해볼 사항
만약 2번이 없다면..? 
1-3 직접 연결되는거는???
>> 그러면 이제 script단에서 procedure 요청하고, protobuf parsing해야하는데,
>> os 단에서 설치해야 될 항목이 좀 있음
https://www.raank.net/post/react_grpcweb_protobuf_part1_ko

>> 2번 구현하려면

서버가 한 대라면 >> gRPC 왜 씀? 걍 내려받으면 되는거 아님?
서버가 여러 대면 >> 이때부터는 통신규격이 필요하지



