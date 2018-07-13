package com.example.tictactoe.controllers

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.web.reactive.function.server.RouterFunctions

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 13.07.18
 */
@Configuration
class WebConfig {
    @Bean
    fun staticResourceRouter() = RouterFunctions.resources("/**", ClassPathResource("/web/"))
}