# 1. 개요

## 1.1 RPC (Remote Procedure Call)

- **정의**
  원격 시스템의 함수를 로컬 함수처럼 호출할 수 있게 해주는 통신 프로토콜.
- **특징**

  - 분산 환경에서 함수 호출을 추상화하여 개발자가 네트워크 세부 구현을 신경 쓰지 않아도 됨.
  - 주로 클라이언트–서버 구조에서 사용.

## 1.2 Protocol Buffers (Protobuf)

- **정의**
  Google에서 개발한 언어 중립적, 플랫폼 독립적인 직렬화(Serialization) 데이터 포맷. gRPC의 기본 데이터 포맷으로 사용된다.

- **특징**

  - **경량화된 바이너리 포맷**: JSON이나 XML보다 전송 크기와 속도 면에서 효율적.
  - **멀티 언어/플랫폼 지원**: Java, C++, Python, Go 등 다양한 언어와 플랫폼 지원.
  - **자동 코드 생성**: `protoc` 컴파일러를 통해 `.proto` 스키마 파일을 각 언어에 맞는 코드로 변환 가능.
  - **스키마 기반 메시지 구조**: `.proto` 파일에 메시지 구조와 필드 타입을 명확히 정의.
  - **빠른 직렬화/역직렬화**: 구조화된 데이터를 빠르고 안정적으로 처리.

## 1.3 gRPC (Google Remote Procedure Call)

- **정의**
  Google에서 개발한 오픈소스 RPC 프레임워크.
  HTTP/2 프로토콜과 Protobuf를 기반으로 효율적인 통신을 제공한다.

- **특징과 장점**

  - **HTTP/2 기반**: 멀티플렉싱, 헤더 압축, 양방향 스트리밍 지원.
  - **다양한 언어 지원**: 공식적으로 10여 개 이상의 언어 지원.
  - **엄격한 인터페이스 정의**: Protobuf 스키마를 기반으로 클라이언트와 서버 간 인터페이스를 강력히 보장.
  - **성능 우수**: JSON/REST 대비 낮은 대역폭 사용, 빠른 응답 속도.
  - **양방향 스트리밍** 지원: 클라이언트–서버가 동시에 데이터를 주고받을 수 있음.

## 1.4 gRPC의 통신 방식 & 작동 원리

- **통신 방식**

  - 클라이언트는 Stub(자동 생성된 코드)을 통해 원격 메서드를 호출.
  - 호출은 HTTP/2 기반으로 전송되며, 메시지는 Protobuf 형식으로 직렬화되어 전달.
  - 서버는 호출된 메서드를 실행하고, 결과를 Protobuf 메시지로 직렬화해 응답.

- **작동 원리**

  ```
  Client → (Stub, Protobuf 직렬화) → HTTP/2 → Server
  Server → (메서드 실행, Protobuf 역직렬화) → 응답
  ```

## 1.5 gRPC의 통신 패턴

1. **Unary RPC**
   클라이언트가 단일 요청을 보내고, 서버가 단일 응답을 반환. (가장 기본적인 형태)
2. **Server Streaming RPC**
   클라이언트가 요청을 보내면, 서버가 여러 응답을 스트리밍으로 전송.
3. **Client Streaming RPC**
   클라이언트가 여러 요청을 스트리밍으로 전송하면, 서버가 단일 응답을 반환.
4. **Bidirectional Streaming RPC**
   클라이언트와 서버가 모두 다중 메시지를 스트리밍으로 주고받을 수 있음.

## 1.6 gRPC와 REST 비교

| 구분              | gRPC                           | REST                                      |
| ----------------- | ------------------------------ | ----------------------------------------- |
| **전송 프로토콜** | HTTP/2                         | HTTP/1.1 (주로)                           |
| **데이터 포맷**   | Protobuf (바이너리)            | JSON, XML (텍스트)                        |
| **성능**          | 빠름 (경량, 멀티플렉싱)        | 비교적 느림                               |
| **스트리밍**      | 양방향 스트리밍 지원           | 일반적으로 단방향                         |
| **계약/스키마**   | Protobuf 기반 강력한 타입 보장 | 스키마 명확성 낮음 (OpenAPI 등 별도 필요) |
| **호환성**        | 언어 간 상호 운용성 우수       | 언어 독립적이지만 데이터 파싱 비용 높음   |

---

# 2. 환경 구축

- 목표
  upbit에서 제공하는 API를 이용
  upbit 서버 - gRPC 서버 - 브라우저
  요청-응답 데이터는 API 단일 요청 & WEBSOCKET 실시간 데이터

- 설계
  -1. upbit 서버 - gRPC 서버 - gRPC 클라이언트 서버 - 브라우저
  -2. upbit 서버 - gRPC 서버 - 프록시 서버 - 브라우저

- 각 방식별 설계 사유 / 이유 / 왜 이렇게 될 수밖에 없는가

---

# 3. 구현 사례

gRPC 서버

- gradle 환경 설정
- IDL 작성(.proto)
- 빌드 및 서버 실행

---

# 4. 각 사례별 상세

## 1. gRPC 중계 서버 기반 접근 방식

### 1-1. gRPC 서버 – Spring Boot – 브라우저

- **개요**
  Spring Boot 애플리케이션이 gRPC 클라이언트 역할을 수행하여 gRPC 서버와 통신하고, 브라우저에는 HTTP/JSON, SSE(Server-Sent Events), 또는 WebSocket을 통해 결과를 전달한다.
- **특징**

  - gRPC Stub을 이용하여 서버와 직접 통신.
  - 단일 요청(unary)은 REST API로 변환 후 제공.
  - 서버 스트리밍은 SSE 또는 WebSocket 엔드포인트로 브라우저에 전달.

- **장점**

  - Java 생태계와의 높은 호환성.
  - 보안, 인증, 로깅 등 엔터프라이즈 운영 환경에 적합.

- **단점**

  - 중간 계층이 추가되므로 레이턴시와 자원 소모 증가.
  - 변환 및 매핑 로직 관리 부담.

### 1-2. gRPC 서버 – Next.js – 브라우저

- **개요**
  Next.js(Node.js 런타임)를 gRPC 클라이언트로 활용하여 gRPC 서버와 통신하고, 브라우저에는 API Route(fetch) 또는 WebSocket을 통해 데이터를 전달한다.
- **특징**

  - `@grpc/grpc-js`를 이용해 gRPC 호출.
  - unary 요청은 API Route에서 JSON 반환.
  - 서버 스트리밍은 Next.js 서버에서 수신 후 WebSocket으로 브라우저에 중계.

- **장점**

  - Envoy Proxy 불필요, 단순한 배포 구조.
  - 풀스택 JS/TS 환경으로 개발 일관성 확보.
  - 브라우저는 fetch + WebSocket만 사용하면 됨.

- **단점**

  - Node 서버가 중계 역할을 하므로, 대규모 스트리밍 환경에서는 백프레셔·확장성 고려 필요.

---

## 2. Envoy Proxy 기반 접근 방식

### Envoy Proxy 정의, 필요성, 설정

- **정의**
  Envoy는 고성능 프록시 서버로, gRPC-web 요청을 표준 gRPC 요청으로 변환하는 역할을 한다.
- **필요성**
  브라우저는 HTTP/2 기반 gRPC를 직접 사용할 수 없으므로, gRPC-web ↔ gRPC 변환 계층이 필요하다.
- **설정**

  - `grpc_web`, `cors`, `http_connection_manager` 필터 사용.
  - Envoy를 통해 gRPC 서버와 브라우저 간 통신을 중계.

### 2-1. gRPC 서버 – Envoy Proxy – React.js (JavaScript, protoc + gRPC-web)

- **개요**

  - `protoc`와 `protoc-gen-grpc-web`을 통해 JavaScript용 클라이언트 코드를 생성.
  - 브라우저에서 `grpc-web` 라이브러리를 통해 Envoy Proxy에 요청.

- **장점**

  - 표준적이고 안정적인 구조.
  - 브라우저에서 Envoy에 직접 연결 가능.

- **단점**

  - Envoy 운영 부담 존재.
  - JavaScript 코드 기반이라 타입 안정성이 부족.
  - 브라우저 환경에서는 서버 스트리밍만 지원(양방향 불가).

### 2-2. gRPC 서버 – Envoy Proxy – React.js (TypeScript, buf + connect-web)

- **브라우저에서 gRPC 사용하기**

  - `buf`를 활용해 proto 스키마 관리 및 TypeScript 코드 생성.
  - `@connectrpc/connect-web` 라이브러리로 gRPC 호출.
  - `@connectrpc/connect-query`를 활용해 React Query와 연동 가능.

- **장점**

  - TypeScript 친화적, 높은 타입 안정성.
  - React Query와 결합 시 캐싱, 에러 처리, 재시도 전략을 일원화 가능.

- **단점**

  - 초기 세팅이 비교적 복잡.
  - Envoy 운영 부담 존재.
  - 브라우저 환경에서는 서버 스트리밍만 지원(양방향 불가).

**최종 요약 비교**

| 방식 | 중계          | 브라우저 클라이언트 | 스트리밍      | 장점                              | 단점                       |
| ---- | ------------- | ------------------- | ------------- | --------------------------------- | -------------------------- |
| 1-1  | Spring Boot   | fetch/WS/SSE        | 지원          | Java 표준, 엔터프라이즈 환경 적합 | 레이턴시 증가, 변환 부담   |
| 1-2  | Next.js(Node) | fetch/WS            | 지원          | Envoy 불필요, JS/TS 일관성        | 확장성 관리 필요           |
| 2-1  | Envoy         | grpc-web(JS)        | 서버 스트리밍 | 표준적, 안정성                    | Envoy 운영, 타입 부족      |
| 2-2  | Envoy         | connect-web(TS)     | 서버 스트리밍 | TS/DX 우수, React Query 연계      | 초기 세팅 복잡, Envoy 운영 |

---

# 5. MSA 환경에서의 gRPC 적용

## 5.1 이점

1. **고성능·저비용 통신**

   - Protobuf 기반 바이너리 직렬화로 JSON 대비 전송 크기가 작고 직렬화 속도가 빠르다.
   - HTTP/2 멀티플렉싱을 활용하여 동일한 TCP 연결에서 다중 스트림을 처리할 수 있어 네트워크 자원을 효율적으로 사용한다.

2. **엄격한 인터페이스 정의**

   - Protobuf 스키마를 통해 서비스 간 API 계약을 명확히 정의한다.
   - 빌드 시점에 Stub 코드가 생성되어, 런타임 오류를 줄이고 안정성을 높인다.

3. **스트리밍 지원**

   - 서버 스트리밍, 클라이언트 스트리밍, 양방향 스트리밍 패턴을 지원하여 실시간 데이터 교환과 이벤트 기반 시스템 구현에 적합하다.

4. **다양한 언어 지원**

   - gRPC는 공식적으로 Java, Go, Python, C++, Node.js 등 다수의 언어를 지원하여, MSA 환경에서 다양한 기술 스택 간의 상호운용성을 높인다.

## 5.2 주의사항

1. **디버깅 및 가시성 확보**

   - Protobuf가 바이너리 포맷이기 때문에 사람이 읽기 어렵다.
   - REST/JSON 대비 로그 확인과 디버깅이 불편하므로, gRPC 전용 툴(grpcurl, BloomRPC 등)이나 관측성 도구(APM, 트레이싱 시스템) 도입이 필요하다.

2. **부하 분산 및 로드 밸런싱**

   - HTTP/2의 장기 연결 특성상, 전통적인 L4 로드밸런서와 호환성 문제가 발생할 수 있다.
   - gRPC에 특화된 L7 로드밸런서(Envoy, Linkerd 등)를 고려해야 한다.

3. **브라우저 직접 사용 불가**

   - 브라우저는 HTTP/2 gRPC를 직접 지원하지 않는다.
   - Web 환경에서는 Envoy Proxy(gRPC-web)나 BFF(Backend for Frontend) 계층을 두어야 한다.

4. **버전 관리와 하위 호환성**

   - 서비스 인터페이스(proto 파일) 변경 시 클라이언트와 서버 동기화 필요.
   - 필드 삭제보다는 `reserved` 키워드 활용 등 호환성 전략이 중요하다.

## 5.3 한계

1. **광범위한 외부 연계 API**

   - gRPC는 내부 MSA 통신에 최적화되어 있으나, 외부 파트너사나 공개 API에는 여전히 REST/JSON이 더 보편적이다.

2. **브라우저 지원 한계**

   - gRPC-web은 unary와 server-streaming만 지원하며, 클라이언트 스트리밍·양방향 스트리밍은 불가능하다.
   - 실시간 양방향 통신이 필요한 Web 환경에서는 WebSocket, SSE 등 보완 기술이 필요하다.

3. **성숙도 및 생태계 차이**

   - REST는 수십 년간 표준으로 자리잡아 도구와 레퍼런스가 풍부하다.
   - gRPC는 빠르게 성장 중이지만, 일부 언어나 프레임워크에서는 도구와 커뮤니티 지원이 제한적일 수 있다.

---

# 6. 추가 고려사항

## 6.1 HTTP/2.0 인증 및 보안 (TLS/SSL)

- gRPC는 기본적으로 HTTP/2 프로토콜을 사용하며, 실제 운영 환경에서는 **TLS/SSL 기반 보안 통신** 적용이 필수적이다.
- 서버 인증서(서버 인증), 클라이언트 인증서(양방향 인증, Mutual TLS)를 통해 서비스 간 보안 수준을 강화할 수 있다.
- 서비스 메시(Service Mesh)나 로드밸런서를 사용할 경우, TLS 종료(termination) 지점에 대한 아키텍처 설계가 필요하다.

## 6.2 Envoy JSON Transcoder 적용

- Envoy Proxy의 **gRPC-JSON Transcoder 필터**를 사용하면, 동일한 gRPC 서비스에 대해 RESTful JSON API를 자동으로 제공할 수 있다.
- 장점:

  - REST 클라이언트와 gRPC 클라이언트가 **동일한 백엔드 서비스**를 사용할 수 있음.
  - 외부 파트너사나 모바일/웹 환경에서 REST/JSON 접근을 쉽게 제공.

- 유의점:

  - Transcoder가 Proto 정의에 기반하므로, `.proto` 파일에 HTTP 옵션을 명시해야 한다.
  - 복잡한 API 매핑 시 세밀한 라우팅 규칙 관리 필요.

---

7. 참고문헌
   https://grpc.io/docs/platforms/web/basics/
   https://connectrpc.com/docs/introduction
   https://tech.ktcloud.com/253
   https://codewiz.info/blog/grpc-browser-ui-integration/
   https://dev.to/arichy/using-grpc-in-react-the-modern-way-from-grpc-web-to-connect-41lc
