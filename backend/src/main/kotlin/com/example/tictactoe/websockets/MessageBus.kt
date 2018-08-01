package com.example.tictactoe.websockets

import com.example.tictactoe.auth.User
import com.example.tictactoe.model.BoardService
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.AuthenticatedMessage
import com.example.tictactoe.websockets.messages.incoming.IncomingBoardMessage
import com.example.tictactoe.websockets.messages.incoming.IncomingMessage
import com.example.tictactoe.websockets.messages.incoming.PingMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerWonMessage
import com.example.tictactoe.websockets.messages.outgoing.PongMessage
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.UnicastProcessor

@Component
class MessageBus(val boardService: BoardService) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    private val incomingMessagesProcessor = UnicastProcessor.create<AuthenticatedMessage<*>>()
    private val incomingMessagesSink = incomingMessagesProcessor.sink()

    private val outgoingMessagesProcessor = UnicastProcessor.create<Message>()
    private val outgoingMessagesSink = outgoingMessagesProcessor.sink()

    private val incomingMessages = incomingMessagesProcessor
        .doOnNext { log.debug("Received message $it") }
        .publish()
        .refCount()

    final val outgoingMessages = Flux.merge(
        outgoingMessagesProcessor,
        incomingMessages
            .ofMessageType<IncomingBoardMessage>()
            .groupBy { (message, _) -> message.boardId }
            .flatMap { boardMessages ->
                // concatMap is crucial here, it provides sequential handling of messages for each board,
                // thereby preventing race condition
                boardMessages
                    .concatMap { (message, user) -> handleIncomingMessageSafely(message, user) }
                    .takeUntil { it is PlayerWonMessage }
            },
        incomingMessages
            .ofMessageType<PingMessage>()
            .map { PongMessage() }
        )
        .publish()

    init {
        outgoingMessages.connect()
    }

    fun onIncomingMessage(messageWrapper: AuthenticatedMessage<*>) {
        incomingMessagesSink.next(messageWrapper)
    }

    fun onOutgoingMessage(message: Message) {
        outgoingMessagesSink.next(message)
    }

    private fun handleIncomingMessageSafely(message: IncomingBoardMessage, user: User): Mono<out Message> {
        return this.handleIncomingMessage(message, user)
            .onErrorResume {
                log.error("An exception occured while processing message", it)
                Mono.empty()
            }
    }

    private fun handleIncomingMessage(message: IncomingBoardMessage, user: User): Mono<out Message> {
        val handler = IncomingMessageHandler(user, boardService)
        return message.acceptVisitor(handler)
    }

    @Suppress("unchecked_cast")
    private final inline fun <reified T : IncomingMessage> Flux<AuthenticatedMessage<*>>.ofMessageType() =
        this
            .filter { (message, _) -> message is T }
            .map { it as AuthenticatedMessage<T> }
}