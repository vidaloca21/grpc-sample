package com.example;

import com.example.sever.GrpcServer;

public class Main {
    private static final int _SERVER_PORT_ = 10010;
    public static void main(String[] args) throws Exception {
        GrpcServer server = new GrpcServer(_SERVER_PORT_);
        server.start();
        server.blockUntilShutDown();
    }
}