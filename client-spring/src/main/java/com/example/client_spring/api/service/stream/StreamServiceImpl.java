package com.example.client_spring.api.service.stream;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.client_spring.grpc.StreamClient;

@Service
public class StreamServiceImpl implements StreamService {

	@Autowired
	private StreamClient streamClient;
	private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
	
	@Override
	public void addEmitter(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    }
	
	@Override
	public void sendMessage(String code) {
        streamClient.subscribe(code, message -> {
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(message);
                } catch (IOException e) {
                    emitters.remove(emitter);
                }
            }
        });
	}
	
}
