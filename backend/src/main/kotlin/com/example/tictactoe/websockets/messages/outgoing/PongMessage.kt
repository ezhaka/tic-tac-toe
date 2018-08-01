package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

class PongMessage : Message {
    override val type: MessageType
        get() = MessageType.PONG
}