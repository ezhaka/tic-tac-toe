package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.websockets.messages.MessageType

class JoinBoardMessage(
    userId: String?,
    boardId: String
) : IncomingBoardMessage(boardId, MessageType.JOIN_BOARD)
