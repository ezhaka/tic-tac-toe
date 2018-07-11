package com.example.tictactoe.websockets

import com.example.tictactoe.auth.GameAuthentication
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.IncomingBoardMessage
import com.example.tictactoe.websockets.messages.incoming.IncomingMessageWrapper
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketMessage
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.security.Principal
import java.util.function.BiFunction
import javax.naming.AuthenticationException

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 26.06.18
 */
@Component
class GameWebSocketHandler(
    val objectMapper: ObjectMapper,
    val messageBus: MessageBus
) : WebSocketHandler {

    private val log = LoggerFactory.getLogger(this.javaClass)

    override fun handle(session: WebSocketSession): Mono<Void> {
        val input = Flux.combineLatest(
            session.receive(),
            session.handshakeInfo.principal,
            BiFunction<WebSocketMessage, Principal, IncomingMessageWrapper<IncomingBoardMessage>> { message, principal ->
                when (principal) {
                    is GameAuthentication -> IncomingMessageWrapper(fromJson(message.payloadAsText), principal.user)
                    else -> throw AuthenticationException("Authentication is not found or has invalid type: $principal")
                }
            }
        )
            .doOnNext {
                messageBus.onNext(it)
            }
//            .doOnComplete {
//                processIncomingMessage(PlayerDisconnectedMessage(session.id))
//            }
//            .doOnError {
//                processIncomingMessage(PlayerDisconnectedMessage(session.id))
//            }
            .then()

        val output = session.send(
            messageBus
                .observe()
                .doOnNext { println("processed $it") }
                .map { session.textMessage(toJson(it)) }
        ).then()

        return Mono.first(input, output)
    }

    private fun fromJson(s: String): IncomingBoardMessage {
        return objectMapper.readValue(s, IncomingBoardMessage::class.java)
    }

    private fun toJson(m: Message): String {
        return objectMapper.writeValueAsString(m)
    }
}