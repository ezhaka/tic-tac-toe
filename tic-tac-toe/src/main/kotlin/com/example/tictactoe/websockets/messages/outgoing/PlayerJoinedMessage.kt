package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.controllers.PlayerDto
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

class PlayerJoinedMessage(
    val boardId: Int,
    val player: PlayerDto
) : Message(MessageType.PLAYER_JOINED)