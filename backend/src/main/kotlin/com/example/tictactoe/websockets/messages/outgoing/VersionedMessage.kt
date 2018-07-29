package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.websockets.messages.Message

interface VersionedMessage : Message {
    val boardVersion: Int
}