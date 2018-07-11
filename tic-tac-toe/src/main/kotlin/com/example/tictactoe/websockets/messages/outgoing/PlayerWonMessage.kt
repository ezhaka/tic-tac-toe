package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.model.Move
import com.example.tictactoe.model.Winner
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 11.07.18
 */
class PlayerWonMessage(
    val boardId: String,
    val move: Move,
    val winner: Winner
) : Message(MessageType.PLAYER_WON)