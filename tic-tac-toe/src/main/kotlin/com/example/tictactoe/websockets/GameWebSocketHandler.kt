package com.example.tictactoe.websockets

import com.example.tictactoe.auth.GameAuthentication
import com.example.tictactoe.controllers.PlayerDto
import com.example.tictactoe.model.BoardProvider
import com.example.tictactoe.model.Move
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.IncomingBoardMessage
import com.example.tictactoe.websockets.messages.incoming.IncomingMessageWrapper
import com.example.tictactoe.websockets.messages.incoming.JoinBoardMessage
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage
import com.example.tictactoe.websockets.messages.outgoing.MoveMadeMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerJoinedMessage
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.core.publisher.Mono
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.reactive.socket.WebSocketMessage
import reactor.core.publisher.ConnectableFlux
import reactor.core.publisher.Flux
import reactor.core.publisher.TopicProcessor
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
    val boardProvider: BoardProvider
) : WebSocketHandler {

    private val log = LoggerFactory.getLogger(this.javaClass)

    // TODO: processor лучше разбить на sink и паблишд часть
    private val processor = TopicProcessor.share<IncomingMessageWrapper<IncomingBoardMessage>>("shared", 1024)

    // TODO: OutgoingMessage?
    private val incomingMessageProcessor: ConnectableFlux<out Message> = processor
        .groupBy { it.message.boardId }
        .flatMap { it.concatMap(this::processIncomingMessage) }
        .retry {
            log.error("An exception occured while processing message", it)
            true
        }
        .publish()

    init {
        incomingMessageProcessor.connect()
    }

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
                processor.onNext(it)
            }
//            .doOnComplete {
//                processIncomingMessage(PlayerDisconnectedMessage(session.id))
//            }
//            .doOnError {
//                processIncomingMessage(PlayerDisconnectedMessage(session.id))
//            }
            .then()

        val output = session.send(
            incomingMessageProcessor
                .doOnNext { println("processed ${it}") }
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

    private fun processIncomingMessage(wrapper: IncomingMessageWrapper<IncomingBoardMessage>): Mono<Message> {
        val (message, user) = wrapper
        return when (message) {
            is MakeMoveMessage -> {
                val move = Move(user.id, message.coordinates)

                boardProvider.getByIdOrDefault(message.boardId)
                    .flatMap { boardProvider.update(it.makeMove(move)) }
                    .thenReturn(MoveMadeMessage(message.boardId, move))
            }

            is JoinBoardMessage -> boardProvider.getByIdOrDefault(message.boardId)
                .map { it.addPlayer(user.id) }
                .flatMap { board ->
                    boardProvider
                        .update(board)
                        .thenReturn(board.getPlayer(user.id))
                }
                .map { PlayerJoinedMessage(message.boardId, PlayerDto(it, user)) }

            else -> Mono.empty()
        }
    }
}