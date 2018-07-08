package com.example.tictactoe.model

import java.time.Instant
import com.fasterxml.jackson.annotation.JsonProperty
import java.util.*

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 27.06.18
 */
data class Board(
    val id: String,
    val moves: List<Move>,
    val players: Set<Player>,
    val createdDate: Instant = Instant.now()
) {
    val isFinished: Boolean = checkIsFinished()

    private constructor(builder: Builder) : this(builder.id, builder.moves, builder.players, builder.createdDate)

    fun makeMove(move: Move): Board {
        val canMakeMove = moves.isEmpty() || moves.last().userId != move.userId

        if (!canMakeMove) {
            throw RuntimeException("tried to make move out of order") // TODO: message
        }

        if (movesMap().containsKey(move.coordinates)) {
            throw RuntimeException("somebody already made a move") // TODO: message
        }

        // TODO: проверить, что координаты адекватные
        return copy(moves = moves + move)
    }

    fun addPlayer(player: Player): Board {
        // TODO: check if player already exist
        return copy(players = players + player)
    }

    fun movesMap(): Map<Coordinates, Move> {
        return moves.map { Pair(it.coordinates, it) }.toMap()
    }

    fun checkIsFinished(): Boolean {
        // TODO
        return false
    }

    fun getPlayerIconType(userId: String): PlayerIconType {
        val (_, iconType) = getPlayer(userId)
        return iconType
    }

    fun getPlayer(userId: String) = players.first { it.userId == userId }

    fun addPlayer(userId: String): Board {
        val existingPlayer = players.firstOrNull { it.userId == userId }
        if (existingPlayer != null) {
            return this
        }

        val nextPlayerIconOrdinal = players.size
        if (nextPlayerIconOrdinal >= PlayerIconType.values().size) {
            throw IllegalStateException("Maximum number of players reached")
        }

        val iconType = PlayerIconType.values()[nextPlayerIconOrdinal]
        return addPlayer(Player(userId, iconType))
    }

    fun removePlayer(userId: String): Board {
        return copy(players = players.filter { it.userId != userId }.toHashSet())
    }

    class Builder {
        var id: String = UUID.randomUUID().toString()
        var moves: List<Move> = ArrayList()
        var players: Set<Player> = HashSet()
        var createdDate: Instant = Instant.now()

        fun build() = Board(this)
    }
}