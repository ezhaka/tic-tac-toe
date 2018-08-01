package com.example.tictactoe.websockets.messages

import com.example.tictactoe.websockets.messages.incoming.JoinBoardMessage
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage
import com.example.tictactoe.websockets.messages.incoming.PingMessage
import com.example.tictactoe.websockets.messages.outgoing.BoardCreatedMessage
import com.example.tictactoe.websockets.messages.outgoing.MoveMadeMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerJoinedMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerWonMessage
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = PingMessage::class, name = "PING"),
    JsonSubTypes.Type(value = BoardCreatedMessage::class, name = "BOARD_CREATED"),
    JsonSubTypes.Type(value = MakeMoveMessage::class, name = "MAKE_MOVE"),
    JsonSubTypes.Type(value = MoveMadeMessage::class, name = "MOVE_MADE"),
    JsonSubTypes.Type(value = JoinBoardMessage::class, name = "JOIN_BOARD"),
    JsonSubTypes.Type(value = PlayerJoinedMessage::class, name = "PLAYER_JOINED"),
    JsonSubTypes.Type(value = PlayerWonMessage::class, name = "PLAYER_WON")
)
@JsonIgnoreProperties(ignoreUnknown = true)
interface Message {
    val type: MessageType
}