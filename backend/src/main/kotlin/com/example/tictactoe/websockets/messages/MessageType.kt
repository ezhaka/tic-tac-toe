package com.example.tictactoe.websockets.messages

enum class MessageType {
    PING,
    PONG,
    BOARD_CREATED,
    MAKE_MOVE,
    MOVE_MADE,
    JOIN_BOARD,
    PLAYER_JOINED,
    PLAYER_WON
}