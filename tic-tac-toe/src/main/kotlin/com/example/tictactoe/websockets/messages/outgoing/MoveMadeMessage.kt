package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.model.Move
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

data class MoveMadeMessage(
    val boardId: Int,
    val move: Move
) : Message {
    override val type: MessageType
        get() = MessageType.MOVE_MADE
}