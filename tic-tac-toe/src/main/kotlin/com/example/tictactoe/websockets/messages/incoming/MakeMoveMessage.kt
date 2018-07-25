package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.model.Coordinates
import com.example.tictactoe.websockets.messages.MessageType

class MakeMoveMessage(
    boardId: Int,
    val coordinates: Coordinates
) : IncomingBoardMessage(boardId, MessageType.MAKE_MOVE)