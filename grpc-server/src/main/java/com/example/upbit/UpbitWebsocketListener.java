package com.example.upbit;

import java.nio.charset.StandardCharsets;

import com.example.service.StreamResponse;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.grpc.stub.StreamObserver;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class UpbitWebsocketListener extends WebSocketListener {
    private static final int NORMAL_CLOSURE_STATUS = 1000;
    private static final String _TICKET_ = "test";
    private String code;
    private String type;
    private StreamObserver<StreamResponse> streamObserver;

    // 현재 연결을 보관 (MultiThread 안전을 위해 volatile)
    private volatile WebSocket ws;

    public UpbitWebsocketListener(String code, String type, StreamObserver<StreamResponse> observer) {
        this.code = code;
        this.type = type;
        this.streamObserver = observer;
    }

    /* 정상 종료 */
    public void close(String reason) {
        WebSocket s = this.ws;
        if (s != null) {
            s.close(NORMAL_CLOSURE_STATUS, reason);
            this.ws = null;
        }
    }

    /* 즉시 강제 종료(비정상) */
    public void cancel() {
        WebSocket s = this.ws;
        if (s != null) {
            s.cancel();
            this.ws = null;
        }
    }

    @Override
    public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
        this.ws = webSocket;

        JsonArray input = new JsonArray();
        JsonObject ticket = new JsonObject();
        JsonObject types = new JsonObject();
        JsonArray codes = new JsonArray();

        ticket.addProperty("ticket", _TICKET_);
        codes.add(code);
        types.addProperty("type", type);
        types.add("codes", codes);

        input.add(ticket);
        input.add(types);
        webSocket.send(input.toString());
    }

    @Override
    public void onMessage(@NotNull WebSocket webSocket, @NotNull ByteString bytes) {
        System.out.println(bytes.string(StandardCharsets.UTF_8));
        String jsonStr = bytes.string(StandardCharsets.UTF_8);

        StreamResponse response = StreamResponse.newBuilder().setMessage(jsonStr).build();
        streamObserver.onNext(response);
    }

    @Override
    public void onClosing(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
        System.out.printf("Socket Closing : %s / %s\n", code, reason);
        // 서버가 먼저 닫으려는 경우
        streamObserver.onCompleted();   //gRPC 스트림도 완료
        webSocket.close(NORMAL_CLOSURE_STATUS, null);
    }

    @Override
    public void onClosed(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
        System.out.printf("Socket Closed : %s / %s\r\n", code, reason);
        // 이미 완료/에러 신호를 보냈다면 추가 동작 필요 없음
    }

    @Override
    public void onFailure(@NotNull WebSocket webSocket, @NotNull Throwable t, @Nullable Response response) {
        System.out.println("Socket Error : " + t.getMessage());
        // Websocket 오류 > gRPC 스트림에도 전달
        streamObserver.onError(t);
    }
}
