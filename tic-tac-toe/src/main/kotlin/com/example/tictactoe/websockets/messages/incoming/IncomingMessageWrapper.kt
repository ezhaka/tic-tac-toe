package com.example.tictactoe.websockets.messages.incoming

import com.example.tictactoe.auth.User

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 04.07.18
 */
data class IncomingMessageWrapper<out M : IncomingBoardMessage>(
    val message: M,
    val user: User
)