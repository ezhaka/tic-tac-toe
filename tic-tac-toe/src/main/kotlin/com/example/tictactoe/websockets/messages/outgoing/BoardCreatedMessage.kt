package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.controllers.BoardDto
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

data class BoardCreatedMessage(val board: BoardDto) : Message {
    override val type: MessageType
        get() = MessageType.BOARD_CREATED
}