package com.example.tictactoe.model

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 30.06.18
 */
class BoardAlreadyExistsException(
    boardId: String
) : RuntimeException("Board with id $boardId already exists")