package com.example.tictactoe.websockets

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
import com.example.tictactoe.websockets.messages.outgoing.PlayerWonMessage
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import reactor.core.publisher.ConnectableFlux
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.TopicProcessor

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 08.07.18
 */
@Component
class MessageBus(val boardProvider: BoardProvider) {

    private val log = LoggerFactory.getLogger(this.javaClass)

    // TODO: processor лучше разбить на sink и паблишд часть
    private val processor = TopicProcessor.share<IncomingMessageWrapper<IncomingBoardMessage>>("shared", 1024)

    // TODO: разобраться с синками
    private val outputSink = TopicProcessor.share<Message>("ololo", 1024)

    // TODO: OutgoingMessage?
    private val incomingMessageProcessor: ConnectableFlux<out Message> = processor
        .doOnNext { log.info("Received message $it") }
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

    fun onNext(messageWrapper: IncomingMessageWrapper<IncomingBoardMessage>) {
        processor.onNext(messageWrapper)
    }

    fun notifySubscribers(message: Message) {
        outputSink.onNext(message)
    }

    fun observe(): Flux<out Message> = Flux.merge(incomingMessageProcessor, outputSink)

    private fun processIncomingMessage(wrapper: IncomingMessageWrapper<IncomingBoardMessage>): Mono<Message> {
        val (message, user) = wrapper
        return when (message) {
            is MakeMoveMessage -> {
                val move = Move(user.id, message.coordinates)

                boardProvider.getById(message.boardId)
                    .flatMap { boardProvider.save(it.makeMove(move)) }
                    .map {
                        if (it.winner != null) {
                            PlayerWonMessage(message.boardId, move, it.winner)
                        } else {
                            MoveMadeMessage(message.boardId, move)
                        }
                    }
            }

            is JoinBoardMessage -> boardProvider.getById(message.boardId)
                .flatMap {
                    if (!it.hasPlayer(user.id)) Mono.just(it.addPlayer(user.id)) else Mono.empty()
                }
                .flatMap { board ->
                    boardProvider
                        .save(board)
                        .thenReturn(board.getPlayer(user.id))
                }
                .map { PlayerJoinedMessage(message.boardId, PlayerDto(it, user)) }

            else -> Mono.empty()
        }
    }
}