package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.auth.User

data class AuthenticatedMessage<out T : IncomingMessage>(
    val message: T,
    val user: User
)