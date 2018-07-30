package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.model.Coordinates
import com.example.tictactoe.websockets.messages.MessageType
import com.example.tictactoe.websockets.messages.MessageVisitor

data class MakeMoveMessage(
    override val boardId: Int,
    val coordinates: Coordinates
) : IncomingBoardMessage {
    override val type: MessageType
        get() = MessageType.MAKE_MOVE

    override fun <T> acceptVisitor(handler: MessageVisitor<T>) = handler.visit(this)
}