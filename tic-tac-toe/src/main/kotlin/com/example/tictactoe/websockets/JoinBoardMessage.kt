package com.example.tictactoe.websockets

class JoinBoardMessage(
    userId: String?,
    boardId: String
) : BoardIncomingMessage(boardId, MessageType.JOIN_BOARD, userId)
