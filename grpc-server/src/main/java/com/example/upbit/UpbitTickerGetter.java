package com.example.upbit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class UpbitTickerGetter {

    public String getTicker(String market) {
        String responseBody = "";
        try {
            String url = "https://api.upbit.com/v1/ticker?markets=" + market;

            // OkHttp 클라이언트 객체 생성
            OkHttpClient client = new OkHttpClient();

            // GET 요청 객체 생성
            Request.Builder builder = new Request.Builder().url(url).get();
            builder.addHeader("Accept", "application/json");
            Request request = builder.build();

            // OkHttp 클라이언트로 GET 요청 객체 전송
            Response response = client.newCall(request).execute();
            if (response.isSuccessful()) {
                // 응답 받아서 처리
                ResponseBody body = response.body();
                if (body != null) {
                    responseBody = body.string();
                    System.out.println("Response body:" + responseBody);
                }
            }
            else {
                System.err.println("*** Error Occurred ***");
            }

        } catch(Exception e) {
            e.printStackTrace();
        }
        return responseBody;
    }
}
