package com.example.client_spring.grpc;

import java.util.function.Consumer;

import org.springframework.stereotype.Component;

import io.grpc.Grpc;
import io.grpc.InsecureChannelCredentials;
import io.grpc.ManagedChannel;
import io.grpc.stub.StreamObserver;

@Component
public class StreamClient {
	private final static String _GRPC_SERVER_ = "localhost:10010";
	private TickerServiceGrpc.TickerServiceStub streamStub;

	public StreamClient() {
		ManagedChannel channel = Grpc.newChannelBuilder(_GRPC_SERVER_, InsecureChannelCredentials.create()).build();
		streamStub = TickerServiceGrpc.newStub(channel);
	}

	public void subscribe(String code, Consumer<String> onMessage) {
		String type = "ticker";
		StreamRequest request = StreamRequest.newBuilder().setType(type).setCode(code).build();
		streamStub.streamTicker(request, new StreamObserver<StreamResponse>() {
			@Override
			public void onNext(StreamResponse response) {
				onMessage.accept(response.getMessage());
			}
			
			@Override
			public void onCompleted() {
				System.out.println("streamStub onComplete");
			}
			
			@Override
			public void onError(Throwable t) {
				t.printStackTrace();
			}
		});
		
	}
	
}
