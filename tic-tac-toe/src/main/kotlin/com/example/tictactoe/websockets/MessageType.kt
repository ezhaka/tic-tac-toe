package com.example.tictactoe.websockets

enum class MessageType {
    SWITCH_ROOM,
    PING,
    MAKE_MOVE,
    MOVE_MADE,
    JOIN_BOARD,
    PLAYER_JOINED,

    PLAYER_DISCONNECTED
}