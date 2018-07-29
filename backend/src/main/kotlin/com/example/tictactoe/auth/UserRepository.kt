package com.example.tictactoe.auth

import org.springframework.data.mongodb.repository.Query
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import reactor.core.publisher.Mono

interface UserRepository : ReactiveMongoRepository<User, String> {
    @Query("{ 'token': ?0 }")
    fun findByToken(token: String): Mono<User>
}