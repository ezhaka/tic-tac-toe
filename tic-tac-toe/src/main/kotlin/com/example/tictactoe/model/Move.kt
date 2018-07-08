package com.example.tictactoe.model

import java.time.Instant

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 27.06.18
 */
class Move(val userId: String, val coordinates: Coordinates, val date: Instant = Instant.now())