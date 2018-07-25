package com.example.tictactoe.model

import kotlin.ranges.IntProgression.Companion.fromClosedRange

data class Winner(
    val userId: String,
    val ranges: List<CoordinateRange>
)

data class CoordinateRange(
    val from: Coordinates,
    val to: Coordinates
)

class WinnerCalculator(private val movesMap: Map<Coordinates, Move>, private val lastMove: Move) {
    private val coordinates = lastMove.coordinates

    fun get(): Winner? {
        val rightUpSequence = diagonalSequence(descendingRange(coordinates.row), ascendingRange(coordinates.column))
        val leftDownSequence = diagonalSequence(ascendingRange(coordinates.row), descendingRange(coordinates.column))
        val leftUpSequence = diagonalSequence(descendingRange(coordinates.row), descendingRange(coordinates.column))
        val rightDownSequence = diagonalSequence(ascendingRange(coordinates.row), ascendingRange(coordinates.column))

        val leftSequence = movesSequence(expandRow(descendingRange(coordinates.column)))
        val rightSequence = movesSequence(expandRow(ascendingRange(coordinates.column)))
        val upSequence = movesSequence(expandColumn(descendingRange(coordinates.row)))
        val downSequence = movesSequence(expandColumn(ascendingRange(coordinates.row)))

        val winningRanges = sequenceOf(
            Pair(leftDownSequence, rightUpSequence),
            Pair(leftUpSequence, rightDownSequence),
            Pair(leftSequence, rightSequence),
            Pair(upSequence, downSequence)
        )
            .map { (from, to) -> CoordinateRange(expand(from).coordinates, expand(to).coordinates) }
            .filter { (from, to) ->
                val length = Integer.max(to.row - from.row, to.column - from.column) + 1
                length >= K_PARAM
            }
            .toList()

        return if (winningRanges.isEmpty()) null else Winner(lastMove.userId, winningRanges)
    }

    private fun expandColumn(range: Sequence<Int>) =
        range.map { row -> Coordinates(row, coordinates.column) }

    private fun expandRow(range: Sequence<Int>) =
        range.map { column -> Coordinates(coordinates.row, column) }

    private fun movesSequence(pairs: Sequence<Coordinates>): Sequence<Move?> {
        return pairs
            .filter { (row, column) ->
                row in 0..(BOARD_SIZE - 1) && column in 0..(BOARD_SIZE - 1)
            }
            .map { (row, column) -> Coordinates(row, column) }
            .map { movesMap[it] }
    }

    private fun diagonalSequence(rowRange: Sequence<Int>, columnRange: Sequence<Int>): Sequence<Move?> {
        return movesSequence(rowRange.zip(columnRange).map { (row, column) -> Coordinates(row, column) })
    }

    private fun expand(sequence: Sequence<Move?>): Move {
        return sequence
            .takeWhile { move: Move? -> move != null && move.userId == lastMove.userId }
            .last()!! // TODO: не круто
    }

    private fun ascendingRange(coordinate: Int): Sequence<Int> {
        return fromClosedRange(coordinate, coordinate + (K_PARAM - 1), 1).asSequence()
    }

    private fun descendingRange(coordinate: Int): Sequence<Int> {
        return fromClosedRange(coordinate, coordinate - (K_PARAM - 1), -1).asSequence()
    }
}