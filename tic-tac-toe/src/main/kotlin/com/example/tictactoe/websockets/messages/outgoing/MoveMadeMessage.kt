package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.model.Move
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

class MoveMadeMessage(
    val boardId: Int,
    val move: Move
) : Message(MessageType.MOVE_MADE)