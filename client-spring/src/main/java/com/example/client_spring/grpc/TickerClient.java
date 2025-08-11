package com.example.client_spring.grpc;

import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

import com.example.client_spring.api.dto.TickerDto;

import io.grpc.Grpc;
import io.grpc.InsecureChannelCredentials;
import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Component
public class TickerClient {
//	private final static Logger log = LoggerFactory.getLogger(TickerClient.class);
	private final static String _GRPC_SERVER_ = "localhost:10010";
	private TickerServiceGrpc.TickerServiceBlockingStub blockingStub;
	private ManagedChannel channel;
	
	@PostConstruct
	public void init() {
		this.channel = Grpc.newChannelBuilder(_GRPC_SERVER_, InsecureChannelCredentials.create()).build();
		this.blockingStub = TickerServiceGrpc.newBlockingStub(channel);
	}

	@PreDestroy
	public void shutdown() throws InterruptedException {
		if (channel != null && !channel.isShutdown()) {
			channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
		}
	}
	
	public TickerDto getTicker(String market) {
		TickerRequest request = TickerRequest.newBuilder().setMarket(market).build();
		TickerResponse response;
		try {
			response = blockingStub.getTicker(request);
			TickerDto ticker = tickerMapper(response);
			return ticker;
		} catch (StatusRuntimeException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	private static TickerDto tickerMapper(TickerResponse res) {
		TickerDto ticker = new TickerDto();
		ticker.setMarket(res.getMarket());
		ticker.setTrade_date(res.getTradeDate());
		ticker.setTrade_time(res.getTradeTime());
		ticker.setTrade_date_kst(res.getTradeDateKst());
		ticker.setTrade_time_kst(res.getTradeTimeKst());
		ticker.setTrade_timestamp(res.getTradeTimestamp());
		ticker.setOpening_price(res.getOpeningPrice());
		ticker.setHigh_price(res.getHighPrice());
		ticker.setLow_price(res.getLowPrice());
		ticker.setTrade_price(res.getTradePrice());
		ticker.setPrev_closing_price(res.getPrevClosingPrice());
		ticker.setChange(res.getChange());
		ticker.setChange_price(res.getChangePrice());
		ticker.setChange_rate(res.getChangeRate());
		ticker.setSigned_change_price(res.getSignedChangePrice());
		ticker.setSigned_change_rate(res.getSignedChangeRate());
		ticker.setTrade_volume(res.getTradeVolume());
		ticker.setAcc_trade_price(res.getAccTradePrice());
		ticker.setAcc_trade_price_24h(res.getAccTradePrice24H());
		ticker.setAcc_trade_volume(res.getAccTradeVolume());
		ticker.setAcc_trade_volume_24h(res.getAccTradeVolume24H());
		ticker.setHighest_52_week_price(res.getHighest52WeekPrice());
		ticker.setHighest_52_week_date(res.getHighest52WeekDate());
		ticker.setLowest_52_week_price(res.getLowest52WeekPrice());
		ticker.setLowest_52_week_date(res.getLowest52WeekDate());
		ticker.setTimestamp(res.getTimestamp());
		return ticker;
	}
	
}
