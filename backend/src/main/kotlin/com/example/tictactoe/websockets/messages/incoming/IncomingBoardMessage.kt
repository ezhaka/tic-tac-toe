package com.example.tictactoe.websockets.messages.incoming

interface IncomingBoardMessage : IncomingMessage {
    val boardId: Int
    fun <T> acceptVisitor(handler: IncomingMessageVisitor<T>): T
}