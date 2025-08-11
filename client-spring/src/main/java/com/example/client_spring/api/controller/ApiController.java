package com.example.client_spring.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.client_spring.api.dto.TickerDto;
import com.example.client_spring.api.service.stream.StreamServiceImpl;
import com.example.client_spring.api.service.ticker.TickerServiceImpl;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class ApiController {

	@Autowired
	private TickerServiceImpl tickerService;
	@Autowired
	private StreamServiceImpl streamService;
	
	@GetMapping(value = "/api/getTicker", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<TickerDto> getTicker(@RequestParam String code) throws Exception {
		log.info("$$$$ code : " + code);
	    TickerDto ticker = tickerService.getTicker(code);
		return ResponseEntity.status(HttpStatus.OK).body(ticker);
	}
	
	@GetMapping(value = "/api/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe(@RequestParam String code) throws Exception {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        streamService.addEmitter(emitter);
        streamService.sendMessage(code);
        return emitter;
	}
}
