package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.model.Move
import com.example.tictactoe.model.Winner
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

class PlayerWonMessage(
    val boardId: Int,
    val move: Move,
    val winner: Winner
) : Message(MessageType.PLAYER_WON)