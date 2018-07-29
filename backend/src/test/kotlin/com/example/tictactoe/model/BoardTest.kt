package com.example.tictactoe.model

import org.junit.Assert
import org.junit.Test

const val FIRST_USER_ID = "first"
const val SECOND_USER_ID = "second"

internal class BoardTest {
    @Test
    fun `first player wins`() {
        val finishedBoard = Board(1)
            .addPlayer(FIRST_USER_ID)
            .addPlayer(SECOND_USER_ID)
            .makeMove(FIRST_USER_ID, 0, 0)
            .makeMove(SECOND_USER_ID, 0, 1)
            .makeMove(FIRST_USER_ID, 1, 0)
            .makeMove(SECOND_USER_ID, 1, 1)
            .makeMove(FIRST_USER_ID, 2, 0)
            .makeMove(SECOND_USER_ID, 2, 1)
            .makeMove(FIRST_USER_ID, 3, 0)

        Assert.assertNotNull(finishedBoard.winner)
        Assert.assertEquals(FIRST_USER_ID, finishedBoard.winner?.userId)
        Assert.assertEquals(
            listOf(CoordinateRange(Coordinates(0, 0), Coordinates(3, 0))),
            finishedBoard.winner?.ranges
        )
    }

    @Test
    fun `x win`() {
        val finishedBoard = Board(1)
            .addPlayer(FIRST_USER_ID)
            .addPlayer(SECOND_USER_ID)
            .makeMove(FIRST_USER_ID, 0, 0)
            .makeMove(SECOND_USER_ID, 7, 0)
            .makeMove(FIRST_USER_ID, 1, 1)
            .makeMove(SECOND_USER_ID, 7, 1)
            .makeMove(FIRST_USER_ID, 2, 2)
            .makeMove(SECOND_USER_ID, 7, 2)
            .makeMove(FIRST_USER_ID, 4, 2)
            .makeMove(SECOND_USER_ID, 8, 0)
            .makeMove(FIRST_USER_ID, 5, 1)
            .makeMove(SECOND_USER_ID, 8, 1)
            .makeMove(FIRST_USER_ID, 6, 0)
            .makeMove(SECOND_USER_ID, 8, 2)
            .makeMove(FIRST_USER_ID, 2, 4)
            .makeMove(SECOND_USER_ID, 9, 0)
            .makeMove(FIRST_USER_ID, 1, 5)
            .makeMove(SECOND_USER_ID, 9, 1)
            .makeMove(FIRST_USER_ID, 0, 6)
            .makeMove(SECOND_USER_ID, 9, 2)
            .makeMove(FIRST_USER_ID, 4, 4)
            .makeMove(SECOND_USER_ID, 7, 4)
            .makeMove(FIRST_USER_ID, 5, 5)
            .makeMove(SECOND_USER_ID, 8, 4)
            .makeMove(FIRST_USER_ID, 6, 6)
            .makeMove(SECOND_USER_ID, 9, 4)
            // FINISH HIM!
            .makeMove(FIRST_USER_ID, 3, 3)

        Assert.assertNotNull(finishedBoard.winner)

        Assert.assertEquals(FIRST_USER_ID, finishedBoard.winner?.userId)

        Assert.assertEquals(
            listOf(
                CoordinateRange(Coordinates(6, 0), Coordinates(0, 6)),
                CoordinateRange(Coordinates(0, 0), Coordinates(6, 6))
            ),
            finishedBoard.winner?.ranges
        )
    }

    @Test
    fun `+ win`() {
        val finishedBoard = Board(1)
            .addPlayer(FIRST_USER_ID)
            .addPlayer(SECOND_USER_ID)
            .makeMove(FIRST_USER_ID, 0, 3)
            .makeMove(SECOND_USER_ID, 7, 0)
            .makeMove(FIRST_USER_ID, 1, 3)
            .makeMove(SECOND_USER_ID, 7, 1)
            .makeMove(FIRST_USER_ID, 2, 3)
            .makeMove(SECOND_USER_ID, 7, 2)
            .makeMove(FIRST_USER_ID, 4, 3)
            .makeMove(SECOND_USER_ID, 8, 0)
            .makeMove(FIRST_USER_ID, 5, 3)
            .makeMove(SECOND_USER_ID, 8, 1)
            .makeMove(FIRST_USER_ID, 6, 3)
            .makeMove(SECOND_USER_ID, 8, 2)
            .makeMove(FIRST_USER_ID, 3, 0)
            .makeMove(SECOND_USER_ID, 9, 0)
            .makeMove(FIRST_USER_ID, 3, 1)
            .makeMove(SECOND_USER_ID, 9, 1)
            .makeMove(FIRST_USER_ID, 3, 2)
            .makeMove(SECOND_USER_ID, 9, 2)
            .makeMove(FIRST_USER_ID, 3, 4)
            .makeMove(SECOND_USER_ID, 7, 4)
            .makeMove(FIRST_USER_ID, 3, 5)
            .makeMove(SECOND_USER_ID, 8, 4)
            .makeMove(FIRST_USER_ID, 3, 6)
            .makeMove(SECOND_USER_ID, 9, 4)
            // FINISH HIM!
            .makeMove(FIRST_USER_ID, 3, 3)

        Assert.assertNotNull(finishedBoard.winner)

        Assert.assertEquals(FIRST_USER_ID, finishedBoard.winner?.userId)

        Assert.assertEquals(
            listOf(
                CoordinateRange(Coordinates(3, 0), Coordinates(3, 6)),
                CoordinateRange(Coordinates(0, 3), Coordinates(6, 3))
            ),
            finishedBoard.winner?.ranges
        )
    }
}