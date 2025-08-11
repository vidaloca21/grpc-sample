package com.example;

import com.example.sever.GrpcServer;

public class Main {
    public static void main(String[] args) throws Exception {
        GrpcServer server = new GrpcServer(10010);
        server.start();
        server.blockUntilShutDown();
    }
}