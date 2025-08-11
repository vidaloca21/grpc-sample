package com.example.sevice;

import com.example.service.*;
import com.example.upbit.UpbitTickerGetter;
import com.example.upbit.UpbitWebsocketListener;
import com.google.gson.Gson;
import io.grpc.stub.StreamObserver;
import okhttp3.OkHttpClient;
import okhttp3.Request;

public class TickerServiceImpl extends TickerServiceGrpc.TickerServiceImplBase {

    @Override
    public void getTicker(TickerRequest request, StreamObserver<TickerResponse> responseObserver) {
        UpbitTickerGetter upbitTickerGetter = new UpbitTickerGetter();
        String requestMarket = request.getMarket();
        String responseBody = upbitTickerGetter.getTicker(requestMarket);

        TickerData data = responseBuilder(responseBody);
        TickerResponse response = TickerResponse.newBuilder()
                .setMarket(data.market)
                .setTradeDate(data.trade_date)
                .setTradeTime(data.trade_time)
                .setTradeDateKst(data.trade_date_kst)
                .setTradeTimeKst(data.trade_time_kst)
                .setTradeTimestamp(data.trade_timestamp)
                .setOpeningPrice(data.opening_price)
                .setHighPrice(data.high_price)
                .setLowPrice(data.low_price)
                .setTradePrice(data.trade_price)
                .setPrevClosingPrice(data.prev_closing_price)
                .setChange(data.change)
                .setChangePrice(data.change_price)
                .setChangeRate(data.change_rate)
                .setSignedChangePrice(data.signed_change_price)
                .setSignedChangeRate(data.signed_change_rate)
                .setTradeVolume(data.trade_volume)
                .setAccTradePrice(data.acc_trade_price)
                .setAccTradePrice24H(data.acc_trade_price_24h)
                .setAccTradeVolume(data.acc_trade_volume)
                .setAccTradeVolume24H(data.acc_trade_volume_24h)
                .setHighest52WeekPrice(data.highest_52_week_price)
                .setHighest52WeekDate(data.highest_52_week_date)
                .setLowest52WeekPrice(data.lowest_52_week_price)
                .setLowest52WeekDate(data.lowest_52_week_date)
                .setTimestamp(data.timestamp)
                .build();

        System.out.println("grpc getTicker response: " + response.toString());
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }


    @Override
    public void streamTicker(StreamRequest request, StreamObserver<StreamResponse> responseObserver) {
        String code = request.getCode();
        String type = request.getType();

        OkHttpClient client = new OkHttpClient();

        Request wsRequest = new Request.Builder()
                .url("wss://api.upbit.com/websocket/v1")
                .build();

        UpbitWebsocketListener webSocketListener = new UpbitWebsocketListener(code, type, responseObserver);
        client.newWebSocket(wsRequest, webSocketListener);
        client.dispatcher().executorService().shutdown();
    }




    public TickerData responseBuilder(String responseBody) {
        Gson gson = new Gson();
        TickerData[] data = gson.fromJson(responseBody, TickerData[].class);
        return data[0];
    }

    public static class TickerData {
        private String market;  //종목 구분 코드
        private String trade_date;  //최근 거래 일자(UTC)
        private String trade_time;  //최근 거래 시각(UTC)
        private String trade_date_kst;  //최근 거래 일자(KST)
        private String trade_time_kst;  //최근 거래 시각(KST)
        private long trade_timestamp; //최근 거래 일시(UTC)
        private double opening_price; //시가
        private double high_price;  //고가
        private double low_price; //저가
        private double trade_price; //종가(현재가)
        private double prev_closing_price;  //전일 종가(UTC 0시 기준)
        private String change;  //보합/상승/하락 구분
        private double change_price;  //변화액의 절대값
        private double change_rate; //변화율의 절대값
        private double signed_change_price; //부호가 있는 변화액
        private double signed_change_rate;  //부호가 있는 변화율
        private double trade_volume;  //가장 최근 거래량
        private double acc_trade_price; //누적 거래대금(UTC 0시 기준)
        private double acc_trade_price_24h; //24시간 누적 거래대금
        private double acc_trade_volume;  //누적 거래량(UTC 0시 기준)
        private double acc_trade_volume_24h;  //24시간 누적 거래량
        private double highest_52_week_price; //52주 신고가
        private String highest_52_week_date;  //52주 신고가
        private double lowest_52_week_price;  //52주 신저가
        private String lowest_52_week_date; //52주 신저가
        private long timestamp; //타임스탬프
    }
}
