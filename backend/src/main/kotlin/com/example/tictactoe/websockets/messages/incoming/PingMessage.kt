package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.websockets.messages.MessageType

class PingMessage : IncomingMessage {
    override val type: MessageType
        get() = MessageType.PING
}