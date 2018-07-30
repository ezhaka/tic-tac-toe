package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.auth.User

data class IncomingMessageWrapper(
    val message: IncomingBoardMessage,
    val user: User
)