package com.example.client_spring.api.service.ticker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.client_spring.api.dto.TickerDto;
import com.example.client_spring.grpc.TickerClient;

@Service
public class TickerServiceImpl implements TickerService {

	@Autowired
	private TickerClient tickerClient;
	
	@Override
	public TickerDto getTicker(String code) {
		TickerDto ticker = new TickerDto();
		ticker = tickerClient.getTicker(code);
		return ticker;
	}
}
