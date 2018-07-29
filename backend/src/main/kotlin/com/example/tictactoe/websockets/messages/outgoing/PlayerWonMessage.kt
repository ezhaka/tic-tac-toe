package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.model.Move
import com.example.tictactoe.model.Winner
import com.example.tictactoe.websockets.messages.MessageType

data class PlayerWonMessage(
    val boardId: Int,
    val move: Move,
    val winner: Winner,
    override val boardVersion: Int
) : VersionedMessage {
    override val type: MessageType
        get() = MessageType.PLAYER_WON
}