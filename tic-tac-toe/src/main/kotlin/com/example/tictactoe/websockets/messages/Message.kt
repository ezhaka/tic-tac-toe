package com.example.tictactoe.websockets.messages

import com.example.tictactoe.websockets.messages.incoming.JoinBoardMessage
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage
import com.example.tictactoe.websockets.messages.outgoing.MoveMadeMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerJoinedMessage
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

abstract class Message(val type: MessageType) {
}