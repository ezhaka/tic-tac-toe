package com.example.tictactoe.model

import java.time.Instant

const val BOARD_SIZE = 10

/**
 * see [m,n,k-game](https://en.wikipedia.org/wiki/M,n,k-game)
 */
const val K_PARAM = 4

data class Board(
    val id: Int,
    val version: Int = 0,
    val moves: List<Move> = emptyList(),
    val players: Set<Player> = emptySet(),
    val createdDate: Instant = Instant.now(),
    val winner: Winner? = null
) {
    fun makeMove(userId: String, row: Int, column: Int) = makeMove(Move(userId, Coordinates(row, column)))

    fun makeMove(move: Move): Board {
        require(winner == null)
        require(move.coordinates.row in 0..(BOARD_SIZE - 1) && move.coordinates.column in 0..(BOARD_SIZE - 1))
        require(players.any { it.userId === move.userId })

        val canMakeMove = moves.isEmpty() || moves.last().userId != move.userId
        require(canMakeMove) { "Tried to make a move ($move) out of order" }

        val movesMap = buildMovesMap(moves)
        require(!movesMap.containsKey(move.coordinates)) { "Somebody already made a move (${move.coordinates})" }

        return copy(
            version = version + 1,
            moves = moves + move,
            winner = WinnerCalculator(movesMap + Pair(move.coordinates, move), move).get()
        )
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
        return copy(
            version = version + 1,
            players = players + Player(userId, iconType)
        )
    }

    fun getPlayer(userId: String) =
        getPlayerOrNull(userId) ?: throw NoSuchElementException("There is no player with userId=$userId")

    fun hasPlayer(userId: String) = getPlayerOrNull(userId) != null

    private fun getPlayerOrNull(userId: String) = players.firstOrNull { it.userId == userId }

    private fun buildMovesMap(moves: List<Move>): Map<Coordinates, Move> {
        return moves.map { Pair(it.coordinates, it) }.toMap()
    }
}