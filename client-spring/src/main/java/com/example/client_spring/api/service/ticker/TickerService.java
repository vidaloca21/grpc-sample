package com.example.client_spring.api.service.ticker;

import com.example.client_spring.api.dto.TickerDto;

public interface TickerService {

	public TickerDto getTicker(String code);
}
