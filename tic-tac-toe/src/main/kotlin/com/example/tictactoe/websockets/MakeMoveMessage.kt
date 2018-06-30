package com.example.tictactoe.websockets

import com.example.tictactoe.model.Coordinates

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 27.06.18
 */
class MakeMoveMessage(
    userId: String?,
    boardId: String,
    val coordinates: Coordinates
) : BoardIncomingMessage(boardId, MessageType.MAKE_MOVE, userId)