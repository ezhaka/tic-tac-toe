package com.example.tictactoe.auth

import org.springframework.http.ResponseCookie
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.web.server.context.ServerSecurityContextRepository
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.time.Duration

class TokenBasedSecurityContextRepository(private val userDao: UserDao) : ServerSecurityContextRepository {
    override fun save(exchange: ServerWebExchange, context: SecurityContext): Mono<Void> {
        return Mono.fromRunnable {
            val token = context.authentication.credentials as String

            val responseCookie = ResponseCookie.from(TOKEN_COOKIE_KEY, token)
                .httpOnly(true)
                .maxAge(Duration.ofDays(30))
                .path("/")
                .build()

            exchange.response.addCookie(responseCookie)
        }
    }

    override fun load(exchange: ServerWebExchange): Mono<SecurityContext> {
        val token = exchange.request.cookies[TOKEN_COOKIE_KEY]?.firstOrNull()?.value ?: return Mono.empty()

        return userDao.getUserByToken(token)
            .map { SecurityContextImpl(GameAuthentication(it)) }
    }
}