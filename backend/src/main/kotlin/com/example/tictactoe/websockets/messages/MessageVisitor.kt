package com.example.tictactoe.websockets.messages

import com.example.tictactoe.websockets.messages.incoming.JoinBoardMessage
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage

interface MessageVisitor<T> {
    fun visit(message: MakeMoveMessage): T
    fun visit(message: JoinBoardMessage): T
}