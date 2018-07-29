package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.controllers.PlayerDto
import com.example.tictactoe.websockets.messages.MessageType

data class PlayerJoinedMessage(
    val boardId: Int,
    val player: PlayerDto,
    override val boardVersion: Int
) : VersionedMessage {
    override val type: MessageType
        get() = MessageType.PLAYER_JOINED
}