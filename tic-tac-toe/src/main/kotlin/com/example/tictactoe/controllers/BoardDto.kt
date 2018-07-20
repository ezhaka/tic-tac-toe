package com.example.tictactoe.controllers

import com.example.tictactoe.auth.User
import com.example.tictactoe.model.Board
import com.example.tictactoe.model.Move
import com.example.tictactoe.model.Player
import com.example.tictactoe.model.PlayerIconType
import com.example.tictactoe.model.Winner
import java.time.Instant

class UserDto(
    val id: String,
    val name: String
) {
    constructor(user: User) : this(user.id, user.name)
}

class PlayerDto(
    val user: UserDto,
    val iconType: PlayerIconType
) {
    constructor(player: Player, user: User) : this(UserDto(user), player.iconType)
}

class BoardDto(
    val id: Int,
    val moves: List<Move>,
    val players: List<PlayerDto>,
    val createdDate: Instant,
    val winner: Winner?
)

fun createBoardDto(board: Board, users: List<User>): BoardDto {
    val usersById = users.associateBy { it.id }

    return BoardDto(
        board.id,
        board.moves,
        board.players.map {
            val user = usersById[it.userId] ?: throw NoSuchElementException("Unable to find user ${it.userId}")
            PlayerDto(it, user)
        },
        board.createdDate,
        board.winner
    )
}