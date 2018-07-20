package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.websockets.messages.MessageType
import com.fasterxml.jackson.annotation.JsonProperty

class JoinBoardMessage(
    @JsonProperty("boardId") boardId: Int
) : IncomingBoardMessage(boardId, MessageType.JOIN_BOARD)
