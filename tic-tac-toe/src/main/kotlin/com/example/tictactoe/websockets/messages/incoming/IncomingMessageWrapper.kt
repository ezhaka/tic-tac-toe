package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.auth.User

data class IncomingMessageWrapper<out M : IncomingBoardMessage>(
    val message: M,
    val user: User
)