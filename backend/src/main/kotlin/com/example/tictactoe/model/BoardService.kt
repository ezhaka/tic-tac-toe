package com.example.tictactoe.model

import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.util.concurrent.atomic.AtomicInteger

@Service
class BoardService(private val repository: BoardRepository) {
    private val lastAssignedId: AtomicInteger = AtomicInteger()

    fun getById(boardId: Int) = repository.findById(boardId)

    fun getActive() = repository.findAllActive()

    fun save(board: Board) = repository.save(board)

    fun create(creatorUserId: String): Mono<Board> {
        val board = Board(id = lastAssignedId.incrementAndGet()).addPlayer(creatorUserId)
        return repository.save(board)
    }
}