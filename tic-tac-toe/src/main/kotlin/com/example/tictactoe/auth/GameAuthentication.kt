package com.example.tictactoe.auth

import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import java.util.Collections

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 23.06.18
 */
class GameAuthentication(val user: User) : Authentication {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return Collections.emptyList()
    }

    override fun setAuthenticated(isAuthenticated: Boolean) {
    }

    override fun getName(): String {
        return user.name
    }

    override fun getCredentials(): Any? {
        return null
    }

    override fun getPrincipal(): Any? {
        return null
    }

    override fun isAuthenticated(): Boolean {
        return true
    }

    override fun getDetails(): Any? {
        return null
    }

    override fun toString(): String {
        return "GameAuthentication(user=$user)"
    }
}