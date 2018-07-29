package com.example.tictactoe.auth

import org.bson.types.ObjectId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.UUID

@Service
class UserService(private val repository: UserRepository) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    fun getUserByToken(token: String): Mono<User> {
        return repository.findByToken(token)
    }

    fun getUsers(ids: List<String>): Flux<User> {
        return repository.findAllById(ids)
    }

    fun createUser(): Mono<User> {
        return Mono.fromCallable {
            val token = UUID.randomUUID().toString()
            User(ObjectId().toString(), generateUserName(), token)
        }
            .flatMap { repository.save(it) }
            .doOnNext { log.info("New user created: $it") }
    }
}