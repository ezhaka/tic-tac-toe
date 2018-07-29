package com.example.tictactoe.model

import org.springframework.beans.factory.InitializingBean
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

@Service
class BoardService(private val repository: BoardRepository) : InitializingBean {
    private val lastAssignedId: AtomicInteger = AtomicInteger()
    private var map: ConcurrentHashMap<Int, Board> = ConcurrentHashMap()

    fun getById(boardId: Int): Mono<Board> {
        if (map[boardId] == null) {
            return repository.findById(boardId)
        }

        return Mono.justOrEmpty(map[boardId])
    }

    fun save(board: Board) = repository.save(board).doOnNext { map[it.id] = it }

    fun create(creatorUserId: String): Mono<Board> {
        val board = Board(id = lastAssignedId.incrementAndGet()).addPlayer(creatorUserId)
        return repository.save(board).doOnNext { map[it.id] = it }
    }

    fun getActive() = Flux.fromStream(
        map.values.stream()
            .filter { it.winner == null }
            .sorted(Comparator.comparing<Board, Instant> { it.createdDate }.reversed())
    )

    override fun afterPropertiesSet() {
        val boards = repository.findAllActive().collectList().block()!!
        map = ConcurrentHashMap(boards.associateBy { it.id })
    }
}