package com.example.tictactoe.websockets

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = SwitchRoomMessage::class, name = "SWITCH_ROOM"),
    JsonSubTypes.Type(value = PingMessage::class, name = "PING"),
    JsonSubTypes.Type(value = MakeMoveMessage::class, name = "MAKE_MOVE"),
    JsonSubTypes.Type(value = MoveMadeMessage::class, name = "MOVE_MADE"),
    JsonSubTypes.Type(value = JoinBoardMessage::class, name = "JOIN_BOARD"),
    JsonSubTypes.Type(value = PlayerJoinedMessage::class, name = "PLAYER_JOINED")
)
abstract class Message(val type: MessageType, var userId: String?) {
}