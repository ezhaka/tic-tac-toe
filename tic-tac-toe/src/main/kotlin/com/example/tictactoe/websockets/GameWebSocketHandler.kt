package com.example.tictactoe.websockets

import com.example.tictactoe.auth.GameAuthentication
import com.example.tictactoe.model.BoardProvider
import com.example.tictactoe.model.Move
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
    private val processor = TopicProcessor.share<Message>("shared", 1024)

    // TODO: OutgoingMessage?
    private val incomingMessageProcessor: ConnectableFlux<out Message> = processor
        .ofType(BoardIncomingMessage::class.java)
        .groupBy { it.boardId }
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
            BiFunction<WebSocketMessage, Principal, Message> { message, principal ->
                when (principal) {
                    is GameAuthentication -> fromJson(message.payloadAsText).apply { userId = principal.user.id }
                    else -> throw AuthenticationException("Authentication is not found or has invalid type: $principal")
                }
            }
        )
            .doOnNext {
                println(it)
                processIncomingMessage(it)
            }
            .doOnComplete {
                processIncomingMessage(PlayerDisconnectedMessage(session.id))
            }
            .doOnError {
                processIncomingMessage(PlayerDisconnectedMessage(session.id))
            }
            .then()

        val output = session.send(
            incomingMessageProcessor
                .doOnNext { println("processed ${it}") }
                .map { session.textMessage(toJson(it)) }
        ).then()

        return Mono.first(input, output)
    }

    private fun processIncomingMessage(message: Message) {
        processor.onNext(message)
    }

    private fun fromJson(s: String): Message {
        return objectMapper.readValue(s, Message::class.java)
    }

    private fun toJson(m: Message): String {
        return objectMapper.writeValueAsString(m)
    }

    private fun processIncomingMessage(message: BoardIncomingMessage): Mono<Message> {
        return when (message) {
            is MakeMoveMessage -> {
                // TODO: eliminate !!
                val move = Move(message.userId!!, message.coordinates)

                boardProvider.getByIdOrDefault(message.boardId)
                    .flatMap { boardProvider.update(it.makeMove(move)) }
                    .thenReturn(MoveMadeMessage(message.userId, message.boardId, move))
            }

            is JoinBoardMessage -> boardProvider.getByIdOrDefault(message.boardId)
                .map { it.addPlayer(message.userId!!) }
                .flatMap { board ->
                    boardProvider
                        .update(board)
                        .thenReturn(board.getPlayer(message.userId!!))
                }
                .map { PlayerJoinedMessage(message.userId!!, message.boardId, it) }

            else -> Mono.empty()
        }
    }


}