package com.example.tictactoe.auth

import java.util.concurrent.ConcurrentHashMap

class UserDao {
    val users = ConcurrentHashMap<String, User>()

    fun getUser(token: String): User? {
        return users[token]
    }

    fun add(user: User) {
        users[user.token] = user
    }
}