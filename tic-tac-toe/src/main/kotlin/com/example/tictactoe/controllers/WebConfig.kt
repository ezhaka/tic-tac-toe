package com.example.tictactoe.controllers

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.web.reactive.function.server.RouterFunctions

@Configuration
class WebConfig {
    @Bean
    fun staticResourceRouter() = RouterFunctions.resources("/**", ClassPathResource("/web/"))
}