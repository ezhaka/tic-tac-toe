package com.example.tictactoe.websockets

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import java.util.HashMap
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.HandlerMapping


/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 26.06.18
 */
@Configuration
class WebSocketsConfig(val gameWebSocketHandler: GameWebSocketHandler) {
    @Bean
    fun handlerMapping(): HandlerMapping {
        val map = HashMap<String, WebSocketHandler>()
        map["/websocket"] = gameWebSocketHandler

        val mapping = SimpleUrlHandlerMapping()
        mapping.urlMap = map
        mapping.order = -1 // before annotated controllers
        return mapping
    }

    @Bean
    fun handlerAdapter(): WebSocketHandlerAdapter {
        return WebSocketHandlerAdapter()
    }
}