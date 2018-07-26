package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.websockets.messages.Message

interface IncomingBoardMessage : Message {
    val boardId: Int
}