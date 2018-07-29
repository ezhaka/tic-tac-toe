package com.example.tictactoe.model

import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

@Component
class BoardProvider {
    private val lastAssignedId: AtomicInteger = AtomicInteger()
    private val map: ConcurrentHashMap<Int, Board> = ConcurrentHashMap()

    fun getById(boardId: Int): Mono<Board> {
        return Mono.justOrEmpty(map[boardId])
    }

    fun save(board: Board): Mono<Board> {
        map[board.id] = board
        return Mono.just(board)
    }

    fun create(creatorUserId: String): Mono<Board> {
        val board = Board(id = lastAssignedId.incrementAndGet()).addPlayer(creatorUserId)
        map[board.id] = board
        return Mono.just(board)
    }

    fun getActive() = Flux.fromStream(
        map.values.stream()
            .filter { it.winner == null }
            .sorted(Comparator.comparing<Board, Instant> { it.createdDate }.reversed())
    )
}