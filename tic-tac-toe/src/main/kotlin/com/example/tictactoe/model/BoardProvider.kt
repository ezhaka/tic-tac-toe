package com.example.tictactoe.model

import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 27.06.18
 */
@Component
class BoardProvider {
    private val map: ConcurrentHashMap<String, Board> = ConcurrentHashMap()

    fun getById(boardId: String): Mono<Board> {
        return Mono.justOrEmpty(map[boardId])
    }

    fun getByIdOrDefault(boardId: String): Mono<Board> {
        return getById(boardId).defaultIfEmpty(Board(boardId, Instant.now(), emptyList(), emptySet()))
    }

    fun save(board: Board): Mono<Void> {
        map[board.id] = board
        return Mono.empty()
    }
}