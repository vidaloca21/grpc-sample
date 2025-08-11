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

    public UpbitWebsocketListener(String code, String type, StreamObserver<StreamResponse> observer) {
        this.code = code;
        this.type = type;
        this.streamObserver = observer;
    }

    @Override
    public void onClosed(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
        System.out.printf("Socket Closed : %s / %s\r\n", code, reason);
    }

    @Override
    public void onClosing(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
        System.out.printf("Socket Closing : %s / %s\n", code, reason);
        webSocket.close(NORMAL_CLOSURE_STATUS, null);
        webSocket.cancel();
    }

    @Override
    public void onFailure(@NotNull WebSocket webSocket, @NotNull Throwable t, @Nullable Response response) {
        System.out.println("Socket Error : " + t.getMessage());
    }

    @Override
    public void onMessage(@NotNull WebSocket webSocket, @NotNull ByteString bytes) {
        System.out.println(bytes.string(StandardCharsets.UTF_8));
        String jsonStr = bytes.string(StandardCharsets.UTF_8);

        StreamResponse response = StreamResponse.newBuilder()
                                                .setMessage(jsonStr)
                                                .build();

        streamObserver.onNext(response);
    }

    @Override
    public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
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
}
