## 1. 개요

### 1.1 RPC (Remote Procedure Call)

- **정의**
  원격 시스템의 함수를 로컬 함수처럼 호출할 수 있게 해주는 통신 프로토콜
- **특징**

  - 분산 환경에서 함수 호출을 추상화하여 개발자가 네트워크 세부 구현을 신경 쓰지 않아도 됨
  - 주로 클라이언트–서버 구조에서 사용

### 1.2 Protocol Buffers (Protobuf)

- **정의**
  Google에서 개발한 언어 중립적, 플랫폼 독립적인 직렬화(Serialization) 데이터 포맷. gRPC의 기본 데이터 포맷으로 사용

- **특징**

  - **경량화된 바이너리 포맷**: JSON이나 XML보다 전송 크기와 속도 면에서 효율적
  - **멀티 언어/플랫폼 지원**: Java, C++, Python, Go 등 다양한 언어와 플랫폼 지원
  - **자동 코드 생성**: `protoc` 컴파일러를 통해 `.proto` 스키마 파일을 각 언어에 맞는 코드로 변환 가능
  - **스키마 기반 메시지 구조**: `.proto` 파일에 메시지 구조와 필드 타입을 명확히 정의
  - **빠른 직렬화/역직렬화**: 구조화된 데이터를 빠르고 안정적으로 처리

### 1.3 gRPC (Google Remote Procedure Call)

- **정의**
  Google에서 개발한 오픈소스 RPC 프레임워크
  HTTP/2 프로토콜과 Protobuf를 기반으로 효율적인 통신을 제공

- **특징과 장점**

  - **HTTP/2 기반**: 멀티플렉싱, 헤더 압축, 양방향 스트리밍 지원
  - **다양한 언어 지원**: 공식적으로 10여 개 이상의 언어 지원
  - **엄격한 인터페이스 정의**: Protobuf 스키마를 기반으로 클라이언트와 서버 간 인터페이스를 강력히 보장
  - **성능 우수**: JSON/REST 대비 낮은 대역폭 사용, 빠른 응답 속도
  - **양방향 스트리밍** 지원: 클라이언트–서버가 동시에 데이터를 주고받을 수 있음

### 1.4 gRPC의 통신 방식 & 작동 원리

- **통신 방식**

  - 클라이언트는 Stub(자동 생성된 코드)을 통해 원격 메서드를 호출
  - 호출은 HTTP/2 기반으로 전송되며, 메시지는 Protobuf 형식으로 직렬화되어 전달
  - 서버는 호출된 메서드를 실행하고, 결과를 Protobuf 메시지로 직렬화해 응답

  ![grpc preview](./landing-2.svg)

### 1.5 gRPC의 통신 패턴

1. **Unary RPC**
   클라이언트가 단일 요청을 보내고, 서버가 단일 응답을 반환 (가장 기본적인 형태)
2. **Server Streaming RPC**
   클라이언트가 요청을 보내면, 서버가 여러 응답을 스트리밍으로 전송
3. **Client Streaming RPC**
   클라이언트가 여러 요청을 스트리밍으로 전송하면, 서버가 단일 응답을 반환
4. **Bidirectional Streaming RPC**
   클라이언트와 서버가 모두 다중 메시지를 스트리밍으로 주고받을 수 있음

### 1.6 gRPC와 REST 비교

| 구분              | gRPC                           | REST                                      |
| ----------------- | ------------------------------ | ----------------------------------------- |
| **전송 프로토콜** | HTTP/2                         | HTTP/1.1 (주로)                           |
| **데이터 포맷**   | Protobuf (바이너리)            | JSON, XML (텍스트)                        |
| **성능**          | 빠름 (경량, 멀티플렉싱)        | 비교적 느림                               |
| **스트리밍**      | 양방향 스트리밍 지원           | 일반적으로 단방향                         |
| **계약/스키마**   | Protobuf 기반 강력한 타입 보장 | 스키마 명확성 낮음 (OpenAPI 등 별도 필요) |
| **호환성**        | 언어 간 상호 운용성 우수       | 언어 독립적이지만 데이터 파싱 비용 높음   |

---

## 2. 목표 및 설계

### 2.1 목표

- **데이터 소스**: Upbit에서 제공하는 공개 API(REST)와 WebSocket 시세 스트림을 활용
- **서비스 경로(최종 사용자 시나리오)**:

  ```
  Upbit 서버 → gRPC 서버 → 브라우저
  ```

- **요청·응답 패턴**

  - **단일 요청(unary)**: 특정 종목의 스냅샷(현재가, 52주 정보 등) 단건 조회
  - **실시간 스트림(server-streaming)**: 시세(Ticker, 체결, 호가 등) WebSocket 기반 실시간 전달

---

### 2.2 설계

#### -1. Application-level 브리지

```
Upbit 서버(REST/WS) ─▶ gRPC 서버(gRPC) ─▶ gRPC 클라이언트 서버(HTTP/WebSocket or SSE) ─▶ 브라우저
```

- **역할**

  - **gRPC 서버**: Upbit REST/WS를 취합·정규화하고 내부 표준 스키마(Proto)로 제공
  - **gRPC 클라이언트 서버(BFF; Next.js/Spring 등)**:

    - gRPC 서버에서 **unary/stream**을 수신
    - 브라우저에는 **HTTP(JSON)/WebSocket 또는 Server-Sent Event(SSE)**로 재노출(브라우저의 native gRPC 제약 해소)

- **브라우저**: fetch(스냅샷) + WebSocket 또는 SSE(실시간)만 사용

#### -2. Proxy-level 변환

```
Upbit 서버(REST/WS) ─▶ gRPC 서버(gRPC) ─▶ 프록시 서버(gRPC-web/HTTP) ─▶ 브라우저
```

- **역할**

  - **gRPC 서버**: 동일(내부 표준 스키마로 제공)
  - **프록시 서버(Envoy 등)**: **gRPC ↔ gRPC-web/JSON** 변환 · CORS/TLS · 로드밸런싱 (추후 확장)

- **브라우저**: grpc-web 클라이언트(JS/TS) 또는 REST(JSON) 호출

---

### 2.3 각 방식별 설계 사유

#### 공통 전제(둘 다 해당)

1. **브라우저의 한계**

   - 브라우저는 **native gRPC(HTTP/2 프레이밍)** 를 직접 사용하지 못함 →
     중간에 **변환 계층**(BFF 또는 프록시)이 **불가피**.

2. **소스 이질성**

   - Upbit는 **REST + WebSocket**을 제공. 내부 표준(Proto)로 **정규화/매핑**하는 레이어가 필요

3. **스트리밍 팬아웃**

   - 다수 클라이언트로의 **실시간 브로드캐스트**(샘플링, 배치, 백프레셔)가 필수

4. **운영 요구**

   - TLS, 인증, 레이트 리밋, 리트라이/백오프, 관측성(로그/지표/트레이싱)

---

#### -1. Application-level 브리지 선택 사유

- **브라우저 제약을 앱 계층에서 해소**

  - BFF(Next.js/Spring)가 **gRPC 클라이언트**가 되어 서버-스트림을 받아 **WebSocket**으로 팬아웃 → 브라우저는 표준 API만 사용

- **프런트 주도 개발/배포**

  - FE가 BFF를 소유하면 **UI/도메인 요구**에 맞춘 응답 포맷·캐싱·집계가 **민첩**하게 진화

- **커스텀 로직 주입 용이**

  - 종목 키 매핑, 파생 필드 계산, 멱등성·디듀핑, 스로틀링 등 **도메인 로직**을 BFF에 배치하기 용이

- **단점(감수해야 하는 것)**

  - BFF가 **중계 비용/복잡도**를 떠안음(스케일링, 백프레셔, 재연결, 핫/콜드 구독)
  - 멀티 인스턴스일 때 **공유 스트림/세션** 설계 필요(예: 중앙 브로커, pub/sub, Redis/NATS)

> **언제 이 방식을 택하나?**
>
> - Envoy 등 인프라 프록시를 **도입/운영하기 어렵거나** FE가 빠르게 실시간 기능을 소유해야 할 때
> - UI 맞춤 **어그리게이션/캐싱**이 빈번하고, 제품 사이클이 빠른 팀

---

#### -2. Proxy-level 변환 선택 사유

- **표준적·범용적 경로**

  - Envoy **grpc_web/JSON Transcoder**로 **브라우저 ↔ gRPC** 변환을 **프록시**에서 해결 → 앱은 코어 로직에 집중.

- **운영 일관성 & 네트워킹 강점**

  - L7 프록시의 **TLS 종료, 라우팅, LB, CORS, 관측성**을 일괄 제공.

- **프런트에서 직접 gRPC-web**

  - 브라우저가 Envoy에 **직결** → 별도 BFF 없이도 단순 호출 가능(unary + server-streaming).

- **단점(감수해야 하는 것)**

  - **프록시 운영 비용**(yaml, 배포, 모니터링)과 조직 합의 필요.
  - 브라우저는 여전히 **양방향 스트리밍 불가**(grpc-web 제약).
  - UI 특화 **집계/캐싱 로직**을 넣기엔 프록시가 **과도하게 범용적**(BFF 대비 유연성↓).

> **언제 이 방식을 택하나?**
>
> - 인프라 팀이 **Envoy 상시 운영**하고 네트워크/보안 표준을 통합하고자 할 때
> - 여러 클라이언트가 **동일 gRPC 백엔드**를 공유하며, 앱별 변형이 적을 때

---

### 2.4 설계 공통 체크리스트

- **스키마(Proto) 설계**

  - Snapshot(unary) 메시지와 Realtime(stream) 메시지 **분리**
  - **필드 호환성**: 번호 고정, `reserved` 사용, optional 명시
  - 타임스탬프는 **UTC + nanos** 기준, 서버/클라 **시계 동기화**

- **데이터 파이프라인**

  - **정규화**: Upbit REST/WS → 내부 표준(Proto) 모델
  - **디듀핑/순서 보장**: trade id/sequence 기반 정렬, 중복 제거
  - **백프레셔**: 샘플링/배치/드롭 정책(예: 50ms 샘플링, 최대 큐 길이)

- **확장성**

  - 멀티 인스턴스 시 스트림 공유: **pub/sub(예: NATS, Redis Stream)** 또는 **중앙 브로커**
  - 핫/콜드 구독 분리: 활성 뷰만 고주기, 백그라운드는 저주기

- **신뢰성**

  - **재연결/재구독**: 마지막 offset/seq 재요청
  - **리트라이 정책**: 지수 백오프, 서킷 브레이커
  - **레이트 리밋**: Upbit 정책 준수(키 단위, 엔드포인트 단위)

- **보안**

  - **TLS**(프록시/앱 어디서 종료할지 명확화)
  - **토큰/키 보관**: 서버측 보관, 브라우저에 노출 금지
  - **도메인별 CORS**: allow-origin/headers 정밀 설정

- **관측성**

  - **메트릭**: 레이턴시, 손실률, 큐 길이, 브로드캐스트 지연
  - **로그/트레이싱**: correlation id, 종목·세션 단위 추적

---

### 2.5 선택 가이드(요약)

| 항목               | -1. Application-level 브리지  | -2. Proxy-level 변환          |
| ------------------ | ----------------------------- | ----------------------------- |
| 변환 위치          | **앱 계층(BFF)**              | **프록시 계층(Envoy)**        |
| 브라우저 클라      | fetch + **WebSocket**         | **grpc-web**(JS/TS) 또는 REST |
| 커스텀 도메인 로직 | **매우 용이**(집계/캐싱/권한) | 제한적(프록시 설정 중심)      |
| 운영 난이도        | 앱 스케일·백프레셔 설계 필요  | 프록시 운영/배포·감사 필요    |
| 스트리밍           | 자유(WS로 팬아웃)             | server-streaming(양방향X)     |
| 적합 상황          | FE 주도·빠른 제품 사이클      | 인프라 표준·다클라이언트 공유 |

---

좋아. 방금 확인한 `grpc-server` 소스 기준으로 **3장 전체**를 다시 썼어.
(현재 레포에 있는 파일/패키지명을 충실히 반영하면서, 바로 쓸 수 있는 빌드/실행/검증 커맨드까지 포함. 마지막에 “오타 패키지명 정리” 권장안도 덧붙였어.)

---

# 3. gRPC 서버

- **구성 단계**

  1. Gradle 환경 설정 → 2) IDL 작성(.proto) → 3) Stub 코드 생성 → 4) 서버 구현 및 실행

- **역할**: Upbit REST/WebSocket 데이터를 내부 **gRPC 서비스(Ticker)** 로 표준화해 제공

---

## 3.1 프로젝트 구조

```
grpc-server/
├─ build.gradle, settings.gradle, gradlew, gradlew.bat
├─ src/main/proto/upbit/ticker.proto
├─ src/main/java/com/example/
│  ├─ Main.java
│  ├─ sever/GrpcServer.java            // ← 패키지 'sever' (오타)
│  ├─ sevice/TickerServiceImpl.java    // ← 패키지 'sevice' (오타)
│  └─ upbit/
│     ├─ UpbitTickerGetter.java        // REST 스냅샷
│     └─ UpbitWebsocketListener.java   // WS 실시간
└─ build/generated/source/proto/main/...  // protoc/grpc-java 산출물
```

---

## 3.2 Gradle 설정

### `build.gradle`

```gradle
plugins {
  id 'java'
  id 'com.google.protobuf' version '0.9.4'
  id 'application'
}

java { toolchain { languageVersion = JavaLanguageVersion.of(17) } }

repositories { mavenCentral() }

ext {
  grpcVersion = '1.62.2'
  protobufVersion = '3.25.3'
}

dependencies {
  implementation "io.grpc:grpc-netty-shaded:${grpcVersion}"
  implementation "io.grpc:grpc-protobuf:${grpcVersion}"
  implementation "io.grpc:grpc-stub:${grpcVersion}"
  implementation "com.google.code.gson:gson:2.11.0"
  implementation "com.squareup.okhttp3:okhttp:4.12.0"
  testImplementation "org.junit.jupiter:junit-jupiter:5.10.2"
}

protobuf {
  protoc { artifact = "com.google.protobuf:protoc:${protobufVersion}" }
  plugins { grpc { artifact = "io.grpc:protoc-gen-grpc-java:${grpcVersion}" } }
  generateProtoTasks {
    all().configureEach {
      plugins { grpc {} }
      builtins { java {} }
    }
  }
}

application {
  // 실행 엔트리포인트
  mainClass = "com.example.Main"
}

test { useJUnitPlatform() }
```

---

## 3.3 IDL 작성(.proto)

```proto
syntax = "proto3";

package upbit;
option java_multiple_files = true;
option java_package = "com.example.service";
option java_outer_classname = "TickerProto";

message TickerRequest {
  string market = 1; // 예: "KRW-DOGE"
}

message TickerResponse {
  string market = 1;
  string trade_price = 2;     // Upbit 원문 문자열 그대로 매핑되어 있을 수 있음
  string trade_timestamp = 3; // epoch millis 문자열
  // ...
}

message StreamRequest {
  string type = 1; // "ticker" 등
  string code = 2; // "KRW-BTC" 등
}

message StreamResponse {
  string message = 1; // Upbit WS 원문 JSON 문자열을 그대로 싣는 구조
}

service TickerService {
  rpc getTicker (TickerRequest) returns (TickerResponse);
  rpc streamTicker (StreamRequest) returns (stream StreamResponse);
}
```

---

## 3.4 서비스 구현

```java
import com.example.service.TickerRequest;
import com.example.service.TickerResponse;
import com.example.service.StreamRequest;
import com.example.service.StreamResponse;
import com.example.service.TickerServiceGrpc;
import com.example.upbit.UpbitTickerGetter;
import com.example.upbit.UpbitWebsocketListener;
import io.grpc.stub.StreamObserver;

public class TickerServiceImpl extends TickerServiceGrpc.TickerServiceImplBase {

  private final UpbitTickerGetter restGetter = new UpbitTickerGetter();
  private final UpbitWebsocketListener wsListener = new UpbitWebsocketListener();

  @Override
  public void getTicker(TickerRequest request, StreamObserver<TickerResponse> responseObserver) {
    try {
      String market = request.getMarket();
      // Upbit REST 호출 → JSON 문자열 반환
      String json = restGetter.getTickerJson(market);

      // JSON에서 필요한 값 추출해 응답 생성 (레포는 Gson 사용)
      // 예시는 단순화
      TickerResponse resp = TickerResponse.newBuilder()
          .setMarket(market)
          .setTradePrice(extractPrice(json))
          .setTradeTimestamp(extractTimestamp(json))
          .build();

      responseObserver.onNext(resp);
      responseObserver.onCompleted();
    } catch (Exception e) {
      responseObserver.onError(e);
    }
  }

  @Override
  public void streamTicker(StreamRequest request, StreamObserver<StreamResponse> responseObserver) {
    // Upbit WS 구독을 시작하고, 수신하는 원문 메시지를 그대로 StreamResponse로 전달
    wsListener.subscribe(
        request.getType(), request.getCode(),
        message -> { // onMessage
          StreamResponse resp = StreamResponse.newBuilder()
              .setMessage(message)
              .build();
          responseObserver.onNext(resp);
        },
        t -> {       // onError
          responseObserver.onError(t);
        },
        () -> {      // onClose
          responseObserver.onCompleted();
        });
  }
}
```

---

## 3.5 서버 부트스트랩

```java
import com.example.sevice.TickerServiceImpl;
import io.grpc.Server;
import io.grpc.netty.shaded.io.grpc.netty.NettyServerBuilder;

public class GrpcServer {
  private final int port;
  private Server server;

  public GrpcServer(int port) { this.port = port; }

  public void start() throws Exception {
    server = NettyServerBuilder.forPort(port)
        .addService(new TickerServiceImpl())
        .permitKeepAliveWithoutCalls(true)
        .maxInboundMessageSize(4 * 1024 * 1024)
        .build()
        .start();
    System.out.println("gRPC server started on port " + port);
    Runtime.getRuntime().addShutdownHook(new Thread(this::stop));
  }

  public void stop() {
    if (server != null) server.shutdown();
  }

  public void blockUntilShutdown() throws InterruptedException {
    if (server != null) server.awaitTermination();
  }
}
```

### `com/example/Main.java`

```java
public class Main {
  public static void main(String[] args) throws Exception {
    int port = Integer.parseInt(System.getProperty("GRPC_PORT", "10010"));
    GrpcServer server = new GrpcServer(port);
    server.start();
    server.blockUntilShutdown();
  }
}
```

---

## 3.6 빌드 & 실행

```bash
# 1) 코드 생성 + 컴파일
./gradlew clean build

# 2) 실행 (plaintext)
java -jar ./build/libs/grpc-server-1.0-SNAPSHOT.jar

```

---

## 4. gRPC 클라이언트

### 1. gRPC 중계 서버 기반 접근 방식

#### 1-1. gRPC 서버 – Spring Boot – 브라우저

- **개요**
  Spring Boot 애플리케이션이 gRPC 클라이언트 역할을 수행하여 gRPC 서버와 통신하고, 브라우저에는 HTTP/JSON, SSE(Server-Sent Events), 또는 WebSocket을 통해 결과를 전달
- **특징**

  - gRPC Stub을 이용하여 서버와 직접 통신
  - 단일 요청(unary)은 REST API로 변환 후 제공
  - 서버 스트리밍은 SSE 또는 WebSocket 엔드포인트로 브라우저에 전달

- **장점**

  - Java 생태계와의 높은 호환성
  - 보안, 인증, 로깅 등 엔터프라이즈 운영 환경에 적합

- **단점**

  - 중간 계층이 추가되므로 레이턴시와 자원 소모 증가
  - 변환 및 매핑 로직 관리 부담

- **구현 내용**

#### 1-2. gRPC 서버 – Next.js – 브라우저

- **개요**
  Next.js(Node.js 런타임)를 gRPC 클라이언트로 활용하여 gRPC 서버와 통신하고, 브라우저에는 API Route(fetch) 또는 WebSocket을 통해 데이터를 전달
- **특징**

  - `@grpc/grpc-js`를 이용해 gRPC 호출
  - unary 요청은 API Route에서 JSON 반환
  - 서버 스트리밍은 Next.js 서버에서 수신 후 WebSocket으로 브라우저에 중계

- **장점**

  - Envoy Proxy 불필요, 단순한 배포 구조
  - 풀스택 JS/TS 환경으로 개발 일관성 확보
  - 브라우저는 fetch + WebSocket만 사용하면 됨

- **단점**

  - Node 서버가 중계 역할을 하므로, 대규모 스트리밍 환경에서는 백프레셔·확장성 고려 필요

- **구현 내용**

---

### 2. Envoy Proxy 기반 접근 방식

#### Envoy Proxy

- **정의**
  Envoy는 고성능 프록시 서버로, gRPC-web 요청을 표준 gRPC 요청으로 변환하는 역할
- **필요성**
  브라우저는 HTTP/2 기반 gRPC를 직접 사용할 수 없으므로, gRPC-web ↔ gRPC 변환 계층이 필요
- **설정**

  - `grpc_web`, `cors`, `http_connection_manager` 필터 사용
  - Envoy를 통해 gRPC 서버와 브라우저 간 통신을 중계

- **구현 내용**

#### 2-1. gRPC 서버 – Envoy Proxy – React.js (JavaScript, protoc + gRPC-web)

- **개요**

  - `protoc`와 `protoc-gen-grpc-web`을 통해 JavaScript용 클라이언트 코드를 생성
  - 브라우저에서 `grpc-web` 라이브러리를 통해 Envoy Proxy에 요청

- **장점**

  - 표준적이고 안정적인 구조
  - 브라우저에서 Envoy에 직접 연결 가능

- **단점**

  - Envoy 운영 부담 존재
  - JavaScript 코드 기반이라 타입 안정성이 부족
  - 브라우저 환경에서는 서버 스트리밍만 지원(양방향 불가)

- **구현 내용**

#### 2-2. gRPC 서버 – Envoy Proxy – React.js (TypeScript, buf + connect-web)

- **브라우저에서 gRPC 사용하기**

  - `buf`를 활용해 proto 스키마 관리 및 TypeScript 코드 생성
  - `@connectrpc/connect-web` 라이브러리로 gRPC 호출
  - `@connectrpc/connect-query`를 활용해 React Query와 연동 가능

- **장점**

  - TypeScript 친화적, 높은 타입 안정성
  - React Query와 결합 시 캐싱, 에러 처리, 재시도 전략을 일원화 가능

- **단점**

  - 초기 세팅이 비교적 복잡
  - Envoy 운영 부담 존재
  - 브라우저 환경에서는 서버 스트리밍만 지원(양방향 불가)

- **구현 내용**

**최종 요약 비교**

| 방식 | 중계          | 브라우저 클라이언트 | 스트리밍      | 장점                              | 단점                       |
| ---- | ------------- | ------------------- | ------------- | --------------------------------- | -------------------------- |
| 1-1  | Spring Boot   | fetch/WS/SSE        | 지원          | Java 표준, 엔터프라이즈 환경 적합 | 레이턴시 증가, 변환 부담   |
| 1-2  | Next.js(Node) | fetch/WS            | 지원          | Envoy 불필요, JS/TS 일관성        | 확장성 관리 필요           |
| 2-1  | Envoy         | grpc-web(JS)        | 서버 스트리밍 | 표준적, 안정성                    | Envoy 운영, 타입 부족      |
| 2-2  | Envoy         | connect-web(TS)     | 서버 스트리밍 | TS/DX 우수, React Query 연계      | 초기 세팅 복잡, Envoy 운영 |

---

## 5. MSA 환경에서의 gRPC 적용

### 5.1 이점

1. **고성능·저비용 통신**

   - Protobuf 기반 바이너리 직렬화로 JSON 대비 전송 크기가 작고 직렬화 속도가 빠름
   - HTTP/2 멀티플렉싱을 활용하여 동일한 TCP 연결에서 다중 스트림을 처리할 수 있어 네트워크 자원을 효율적으로 사용

2. **엄격한 인터페이스 정의**

   - Protobuf 스키마를 통해 서비스 간 API 계약을 명확히 정의
   - 빌드 시점에 Stub 코드가 생성되어, 런타임 오류를 줄이고 안정성을 높임

3. **스트리밍 지원**

   - 서버 스트리밍, 클라이언트 스트리밍, 양방향 스트리밍 패턴을 지원하여 실시간 데이터 교환과 이벤트 기반 시스템 구현에 적합

4. **다양한 언어 지원**

   - gRPC는 공식적으로 Java, Go, Python, C++, Node.js 등 다수의 언어를 지원하여, MSA 환경에서 다양한 기술 스택 간의 상호운용성을 높임

### 5.2 주의사항

1. **디버깅 및 가시성 확보**

   - Protobuf가 바이너리 포맷이기 때문에 사람이 읽기 어려움
   - REST/JSON 대비 로그 확인과 디버깅이 불편하므로, gRPC 전용 툴(grpcurl, BloomRPC 등)이나 관측성 도구(APM, 트레이싱 시스템) 도입이 필요

2. **부하 분산 및 로드 밸런싱**

   - HTTP/2의 장기 연결 특성상, 전통적인 L4 로드밸런서와 호환성 문제가 발생할 수 있음
   - gRPC에 특화된 L7 로드밸런서(Envoy, Linkerd 등)를 고려해야 함

3. **브라우저 직접 사용 불가**

   - 브라우저는 HTTP/2 gRPC를 직접 지원하지 않음
   - Web 환경에서는 Envoy Proxy(gRPC-web)나 BFF(Backend for Frontend) 계층을 두어야 함

4. **버전 관리와 하위 호환성**

   - 서비스 인터페이스(proto 파일) 변경 시 클라이언트와 서버 동기화 필요
   - 필드 삭제보다는 `reserved` 키워드 활용 등 호환성 전략이 중요

### 5.3 한계

1. **광범위한 외부 연계 API**

   - gRPC는 내부 MSA 통신에 최적화되어 있으나, 외부 파트너사나 공개 API에는 여전히 REST/JSON이 더 보편적

2. **브라우저 지원 한계**

   - gRPC-web은 unary와 server-streaming만 지원하며, 클라이언트 스트리밍·양방향 스트리밍은 불가능
   - 실시간 양방향 통신이 필요한 Web 환경에서는 WebSocket, SSE 등 보완 기술이 필요

3. **성숙도 및 생태계 차이**

   - REST는 수십 년간 표준으로 자리잡아 도구와 레퍼런스가 풍부
   - gRPC는 빠르게 성장 중이지만, 일부 언어나 프레임워크에서는 도구와 커뮤니티 지원이 제한적일 수 있음

---

## 6. 추가 고려사항

### 6.1 HTTP/2.0 인증 및 보안 (TLS/SSL)

- gRPC는 기본적으로 HTTP/2 프로토콜을 사용하며, 실제 운영 환경에서는 **TLS/SSL 기반 보안 통신** 적용이 필수적
- 서버 인증서(서버 인증), 클라이언트 인증서(양방향 인증, Mutual TLS)를 통해 서비스 간 보안 수준을 강화할 수 있음
- 서비스 메시(Service Mesh)나 로드밸런서를 사용할 경우, TLS 종료(termination) 지점에 대한 아키텍처 설계가 필요

### 6.2 Envoy JSON Transcoder 적용

- Envoy Proxy의 **gRPC-JSON Transcoder 필터**를 사용하면, 동일한 gRPC 서비스에 대해 RESTful JSON API를 자동으로 제공할 수 있음
- 장점:

  - REST 클라이언트와 gRPC 클라이언트가 **동일한 백엔드 서비스**를 사용할 수 있음
  - 외부 파트너사나 모바일/웹 환경에서 REST/JSON 접근을 쉽게 제공

- 유의점:

  - Transcoder가 Proto 정의에 기반하므로, `.proto` 파일에 HTTP 옵션을 명시해야 함
  - 복잡한 API 매핑 시 세밀한 라우팅 규칙 관리 필요

---

### 참고문헌

https://grpc.io/docs/platforms/web/basics/  
https://connectrpc.com/docs/introduction  
https://tech.ktcloud.com/253  
https://codewiz.info/blog/grpc-browser-ui-integration/  
https://dev.to/arichy/using-grpc-in-react-the-modern-way-from-grpc-web-to-connect-41lc
