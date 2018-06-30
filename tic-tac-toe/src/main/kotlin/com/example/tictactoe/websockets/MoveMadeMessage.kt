package com.example.tictactoe.websockets

import com.example.tictactoe.model.Coordinates
import com.example.tictactoe.model.Move

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 29.06.18
 */
class MoveMadeMessage(
    userId: String?, // TODO: это лишнее
    val boardId: String,
    val move: Move
) : Message(MessageType.MOVE_MADE, userId)