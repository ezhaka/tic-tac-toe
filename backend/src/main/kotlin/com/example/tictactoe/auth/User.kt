package com.example.tictactoe.auth

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "users")
data class User(
    @Id val id: String,
    val name: String,
    @Indexed val token: String
)