package com.example.tictactoe.model

import java.time.Instant
import java.util.UUID

const val BOARD_SIZE = 10

/**
 * see [m,n,k-game](https://en.wikipedia.org/wiki/M,n,k-game)
 */
const val K_PARAM = 4

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 27.06.18
 */
data class Board(
    val id: String = UUID.randomUUID().toString(),
    val moves: List<Move> = emptyList(),
    val players: Set<Player> = emptySet(),
    val createdDate: Instant = Instant.now(),
    val winner: Winner? = null
) {
    fun makeMove(userId: String, row: Int, column: Int) = makeMove(Move(userId, Coordinates(row, column)))

    fun makeMove(move: Move): Board {
        require(winner == null)
        require(move.coordinates.row in 0..(BOARD_SIZE - 1) && move.coordinates.column in 0..(BOARD_SIZE - 1))
        val canMakeMove = moves.isEmpty() || moves.last().userId != move.userId

        if (!canMakeMove) {
            throw RuntimeException("Tried to make a move out of order") // TODO: message
        }

        if (movesMap(moves).containsKey(move.coordinates)) {
            throw RuntimeException("Somebody already made a move") // TODO: message
        }

        return copy(moves = moves + move, winner = WinnerCalculator(movesMap(moves + move), move).get())
    }

    private fun movesMap(moves: List<Move>): Map<Coordinates, Move> {
        return moves.map { Pair(it.coordinates, it) }.toMap()
    }

    fun addPlayer(userId: String): Board {
        require(winner == null)
        val existingPlayer = players.firstOrNull { it.userId == userId }
        if (existingPlayer != null) {
            return this
        }

        val nextPlayerIconOrdinal = players.size
        if (nextPlayerIconOrdinal >= PlayerIconType.values().size) {
            throw IllegalStateException("Maximum number of players has reached")
        }

        val iconType = PlayerIconType.values()[nextPlayerIconOrdinal]
        return copy(players = players + Player(userId, iconType))
    }

    fun getPlayer(userId: String) =
        getPlayerOrNull(userId) ?: throw NoSuchElementException("There is no player with userId=$userId")

    fun hasPlayer(userId: String) = getPlayerOrNull(userId) != null

    private fun getPlayerOrNull(userId: String) = players.firstOrNull { it.userId == userId }
}