import * as jspb from 'google-protobuf'



export class TickerRequest extends jspb.Message {
  getMarket(): string;
  setMarket(value: string): TickerRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TickerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TickerRequest): TickerRequest.AsObject;
  static serializeBinaryToWriter(message: TickerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TickerRequest;
  static deserializeBinaryFromReader(message: TickerRequest, reader: jspb.BinaryReader): TickerRequest;
}

export namespace TickerRequest {
  export type AsObject = {
    market: string,
  }
}

export class TickerResponse extends jspb.Message {
  getMarket(): string;
  setMarket(value: string): TickerResponse;

  getTradeDate(): string;
  setTradeDate(value: string): TickerResponse;

  getTradeTime(): string;
  setTradeTime(value: string): TickerResponse;

  getTradeDateKst(): string;
  setTradeDateKst(value: string): TickerResponse;

  getTradeTimeKst(): string;
  setTradeTimeKst(value: string): TickerResponse;

  getTradeTimestamp(): number;
  setTradeTimestamp(value: number): TickerResponse;

  getOpeningPrice(): number;
  setOpeningPrice(value: number): TickerResponse;

  getHighPrice(): number;
  setHighPrice(value: number): TickerResponse;

  getLowPrice(): number;
  setLowPrice(value: number): TickerResponse;

  getTradePrice(): number;
  setTradePrice(value: number): TickerResponse;

  getPrevClosingPrice(): number;
  setPrevClosingPrice(value: number): TickerResponse;

  getChange(): string;
  setChange(value: string): TickerResponse;

  getChangePrice(): number;
  setChangePrice(value: number): TickerResponse;

  getChangeRate(): number;
  setChangeRate(value: number): TickerResponse;

  getSignedChangePrice(): number;
  setSignedChangePrice(value: number): TickerResponse;

  getSignedChangeRate(): number;
  setSignedChangeRate(value: number): TickerResponse;

  getTradeVolume(): number;
  setTradeVolume(value: number): TickerResponse;

  getAccTradePrice(): number;
  setAccTradePrice(value: number): TickerResponse;

  getAccTradePrice24h(): number;
  setAccTradePrice24h(value: number): TickerResponse;

  getAccTradeVolume(): number;
  setAccTradeVolume(value: number): TickerResponse;

  getAccTradeVolume24h(): number;
  setAccTradeVolume24h(value: number): TickerResponse;

  getHighest52WeekPrice(): number;
  setHighest52WeekPrice(value: number): TickerResponse;

  getHighest52WeekDate(): string;
  setHighest52WeekDate(value: string): TickerResponse;

  getLowest52WeekPrice(): number;
  setLowest52WeekPrice(value: number): TickerResponse;

  getLowest52WeekDate(): string;
  setLowest52WeekDate(value: string): TickerResponse;

  getTimestamp(): number;
  setTimestamp(value: number): TickerResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TickerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TickerResponse): TickerResponse.AsObject;
  static serializeBinaryToWriter(message: TickerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TickerResponse;
  static deserializeBinaryFromReader(message: TickerResponse, reader: jspb.BinaryReader): TickerResponse;
}

export namespace TickerResponse {
  export type AsObject = {
    market: string,
    tradeDate: string,
    tradeTime: string,
    tradeDateKst: string,
    tradeTimeKst: string,
    tradeTimestamp: number,
    openingPrice: number,
    highPrice: number,
    lowPrice: number,
    tradePrice: number,
    prevClosingPrice: number,
    change: string,
    changePrice: number,
    changeRate: number,
    signedChangePrice: number,
    signedChangeRate: number,
    tradeVolume: number,
    accTradePrice: number,
    accTradePrice24h: number,
    accTradeVolume: number,
    accTradeVolume24h: number,
    highest52WeekPrice: number,
    highest52WeekDate: string,
    lowest52WeekPrice: number,
    lowest52WeekDate: string,
    timestamp: number,
  }
}

export class StreamRequest extends jspb.Message {
  getType(): string;
  setType(value: string): StreamRequest;

  getCode(): string;
  setCode(value: string): StreamRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StreamRequest): StreamRequest.AsObject;
  static serializeBinaryToWriter(message: StreamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamRequest;
  static deserializeBinaryFromReader(message: StreamRequest, reader: jspb.BinaryReader): StreamRequest;
}

export namespace StreamRequest {
  export type AsObject = {
    type: string,
    code: string,
  }
}

export class StreamResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): StreamResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StreamResponse): StreamResponse.AsObject;
  static serializeBinaryToWriter(message: StreamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamResponse;
  static deserializeBinaryFromReader(message: StreamResponse, reader: jspb.BinaryReader): StreamResponse;
}

export namespace StreamResponse {
  export type AsObject = {
    message: string,
  }
}

