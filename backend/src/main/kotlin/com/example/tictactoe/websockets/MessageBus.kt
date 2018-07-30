package com.example.tictactoe.websockets

import com.example.tictactoe.controllers.PlayerDto
import com.example.tictactoe.model.BoardService
import com.example.tictactoe.model.Move
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.IncomingMessageWrapper
import com.example.tictactoe.websockets.messages.incoming.JoinBoardMessage
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage
import com.example.tictactoe.websockets.messages.outgoing.MoveMadeMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerJoinedMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerWonMessage
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.UnicastProcessor

@Component
class MessageBus(val boardService: BoardService) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    private val incomingMessagesProcessor = UnicastProcessor.create<IncomingMessageWrapper>()
    private val incomingMessagesSink = incomingMessagesProcessor.sink()

    private val outgoingMessagesProcessor = UnicastProcessor.create<Message>()
    private val outgoingMessagesSink = outgoingMessagesProcessor.sink()

    final val outgoingMessages = Flux.merge(
        outgoingMessagesProcessor,
        incomingMessagesProcessor
            .doOnNext { log.info("Received message $it") }
            .groupBy { it.message.boardId }
            .flatMap { boardMessages ->
                boardMessages.concatMap(this::processIncomingMessageSafely)
                    .takeUntil { it is PlayerWonMessage }
            }
    )
        .publish()

    init {
        outgoingMessages.connect()
    }

    fun onIncomingMessage(messageWrapper: IncomingMessageWrapper) {
        incomingMessagesSink.next(messageWrapper)
    }

    fun onOutgoingMessage(message: Message) {
        outgoingMessagesSink.next(message)
    }

    private fun processIncomingMessageSafely(message: IncomingMessageWrapper): Mono<Message> {
        return this.processIncomingMessage(message)
            .onErrorResume {
                log.error("An exception occured while processing message", it)
                Mono.empty()
            }
    }

    private fun processIncomingMessage(wrapper: IncomingMessageWrapper): Mono<Message> {
        val (message, user) = wrapper
        return when (message) {
            is MakeMoveMessage -> {
                val move = Move(user.id, message.coordinates)

                boardService.getById(message.boardId)
                    .flatMap { boardService.save(it.makeMove(move)) }
                    .map {
                        if (it.winner != null) {
                            PlayerWonMessage(message.boardId, move, it.winner, it.version)
                        } else {
                            MoveMadeMessage(message.boardId, move, it.version)
                        }
                    }
            }

            is JoinBoardMessage -> boardService.getById(message.boardId)
                .flatMap {
                    if (!it.hasPlayer(user.id)) Mono.just(it.addPlayer(user.id)) else Mono.empty()
                }
                .flatMap { board ->
                    boardService.save(board)
                }
                .map {
                    PlayerJoinedMessage(
                        message.boardId,
                        PlayerDto(it.getPlayer(user.id), user),
                        it.version
                    )
                }

            else -> Mono.empty()
        }
    }
}