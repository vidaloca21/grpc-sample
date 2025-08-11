package com.example.client_spring.api.service.stream;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface StreamService {

	public void addEmitter(SseEmitter emitter);
	public void sendMessage(String code);
}
