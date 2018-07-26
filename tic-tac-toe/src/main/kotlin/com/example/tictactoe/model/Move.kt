package com.example.tictactoe.model

import java.time.Instant

data class Move(
    val userId: String,
    val coordinates: Coordinates,
    val date: Instant = Instant.now()
)
