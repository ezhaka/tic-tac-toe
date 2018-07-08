package com.example.tictactoe.auth

import java.util.concurrent.ConcurrentHashMap

class UserDao {
    private val users = ConcurrentHashMap<String, User>()

    fun getUserByToken(token: String): User? {
        return users.values.find { it.token == token }
    }

    fun add(user: User) {
        users[user.id] = user
    }

    fun getUsers(ids: List<String>): List<User> {
        return ids.map {
            users[it] ?: throw NoSuchElementException("Unable to find user with id $it")
        }
    }
}