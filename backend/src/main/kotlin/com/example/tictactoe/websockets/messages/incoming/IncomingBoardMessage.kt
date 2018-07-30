package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageVisitor

interface IncomingBoardMessage : Message {
    fun <T> acceptVisitor(handler: MessageVisitor<T>): T

    val boardId: Int
}