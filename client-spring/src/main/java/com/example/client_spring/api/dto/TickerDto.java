package com.example.client_spring.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TickerDto {
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
