package com.example.tictactoe.model

import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface BoardRepository : ReactiveMongoRepository<Board, Int> {
    @Query("{ 'winner': null }")
    fun findAllActive(): Flux<Board>

    fun findFirstByOrderByIdDesc(): Mono<Board>
}