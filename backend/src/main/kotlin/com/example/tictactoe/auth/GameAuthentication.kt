package com.example.tictactoe.auth

import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import java.util.Collections

class GameAuthentication(val user: User) : Authentication {
    override fun getName() = user.name
    override fun getCredentials() = user.token

    override fun setAuthenticated(isAuthenticated: Boolean) {
    }

    override fun isAuthenticated() = true

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = Collections.emptyList()
    override fun getDetails() = null
    override fun getPrincipal() = null

    override fun toString(): String {
        return "GameAuthentication(user=$user)"
    }
}