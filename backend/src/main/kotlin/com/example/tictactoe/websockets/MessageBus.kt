package com.example.tictactoe.websockets

import com.example.tictactoe.model.BoardService
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.IncomingMessageWrapper
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
                boardMessages.concatMap(this::handleIncomingMessageSafely)
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

    private fun handleIncomingMessageSafely(message: IncomingMessageWrapper): Mono<out Message> {
        return this.handleIncomingMessage(message)
            .onErrorResume {
                log.error("An exception occured while processing message", it)
                Mono.empty()
            }
    }

    private fun handleIncomingMessage(wrapper: IncomingMessageWrapper): Mono<out Message> {
        val (message, user) = wrapper
        val handler = IncomingMessageHandler(user, boardService)
        return message.acceptVisitor(handler)
    }
}