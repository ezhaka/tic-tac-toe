package com.example.tictactoe.websockets

import com.example.tictactoe.model.Player

class PlayerJoinedMessage(
    userId: String, // TODO: он здесь не нужен
    val boardId: String,
    val player: Player
) : Message(MessageType.PLAYER_JOINED, userId)