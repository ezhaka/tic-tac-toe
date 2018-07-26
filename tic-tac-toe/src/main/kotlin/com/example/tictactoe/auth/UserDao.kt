package com.example.tictactoe.auth

import org.slf4j.LoggerFactory
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

class UserDao {
    private val log = LoggerFactory.getLogger(this.javaClass)

    private val byId = ConcurrentHashMap<String, User>()
    private val byToken = ConcurrentHashMap<String, User>()

    fun getUserByToken(token: String): Mono<User> {
        return byToken[token]?.toMono() ?: Mono.empty()
    }

    fun getUsers(ids: List<String>): List<User> {
        return ids.map {
            byId[it] ?: throw NoSuchElementException("Unable to find user with id $it")
        }
    }

    fun createUser(): Mono<User> {
        return Mono.fromCallable {
            // TODO: maybe just use int?
            val id = UUID.randomUUID().toString()
            val token = UUID.randomUUID().toString()
            val user = User(id, generateUserName(), token)
            byId[user.id] = user
            byToken[user.token] = user
            user
        }
            .doOnNext { log.info("New user created: $it") }
    }
}