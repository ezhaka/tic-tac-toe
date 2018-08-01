package com.example.tictactoe.websockets.messages.incoming

interface IncomingMessageVisitor<T> {
    fun visit(message: MakeMoveMessage): T
    fun visit(message: JoinBoardMessage): T
    fun visit(message: PingMessage): T
}