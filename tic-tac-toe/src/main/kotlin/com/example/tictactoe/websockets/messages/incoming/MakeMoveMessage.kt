package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.model.Coordinates
import com.example.tictactoe.websockets.messages.MessageType

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 27.06.18
 */
class MakeMoveMessage(
    boardId: Int,
    val coordinates: Coordinates
) : IncomingBoardMessage(boardId, MessageType.MAKE_MOVE)