package com.example.client_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ClientSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClientSpringApplication.class, args);
	}

}
