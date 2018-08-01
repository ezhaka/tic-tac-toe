package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.websockets.messages.MessageType
import com.fasterxml.jackson.annotation.JsonProperty

data class JoinBoardMessage(
    @JsonProperty("boardId") override val boardId: Int
) : IncomingBoardMessage {
    override val type: MessageType
        get() = MessageType.JOIN_BOARD

    override fun <T> acceptVisitor(handler: IncomingMessageVisitor<T>) = handler.visit(this)
}
