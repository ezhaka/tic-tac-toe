package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 29.06.18
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = MakeMoveMessage::class, name = "MAKE_MOVE"),
    JsonSubTypes.Type(value = JoinBoardMessage::class, name = "JOIN_BOARD")
)
abstract class IncomingBoardMessage(
    val boardId: String,
    type: MessageType
) : Message(type)