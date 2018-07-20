package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.model.Move
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 29.06.18
 */
class MoveMadeMessage(
    val boardId: Int,
    val move: Move
) : Message(MessageType.MOVE_MADE)