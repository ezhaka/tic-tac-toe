package com.example.tictactoe.websockets

import com.example.tictactoe.auth.GameAuthentication
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.IncomingBoardMessage
import com.example.tictactoe.websockets.messages.incoming.IncomingMessageWrapper
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.security.Principal
import java.util.function.BiFunction
import javax.naming.AuthenticationException

@Component
class GameWebSocketHandler(
    val objectMapper: ObjectMapper,
    val messageBus: MessageBus
) : WebSocketHandler {
    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = Flux
            .combineLatest(
                session.receive().map { messageFromJson(it.payloadAsText) },
                session.handshakeInfo.principal,
                BiFunction { message: IncomingBoardMessage, principal: Principal ->
                    when (principal) {
                        is GameAuthentication -> IncomingMessageWrapper(message, principal.user)
                        else ->
                            throw AuthenticationException(
                                "Authentication is not found or has invalid type: $principal"
                            )
                    }
                }
            )
            .doOnNext { messageBus.onIncomingMessage(it) }
            .then()

        val output = session
            .send(messageBus.outgoingMessages.map { session.textMessage(messageToJson(it)) })
            .then()

        return Mono.first(input, output)
    }

    private fun messageToJson(message: Message) = objectMapper.writeValueAsString(message)

    private fun messageFromJson(s: String) = objectMapper.readValue(s, IncomingBoardMessage::class.java)
}