package com.example.tictactoe.auth

import org.springframework.context.annotation.Bean
import org.springframework.http.HttpCookie
import org.springframework.http.ResponseCookie
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono
import java.util.*


/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 23.06.18
 */
@EnableWebFluxSecurity
class SecurityConfiguration {
    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        val filter = AuthenticationWebFilter({ Mono.just(it) })

        filter.setAuthenticationConverter { exchange ->
            val tokenCookieKey = "token"
            val tokenCookie: HttpCookie? = exchange.request.cookies.getFirst(tokenCookieKey)
            val user = if (tokenCookie === null) {
                generateNewUser(exchange, tokenCookieKey)
            } else {
                userDao().getUser(tokenCookie.value) ?: generateNewUser(exchange, tokenCookieKey)
            }

            Mono.just(GameAuthentication(user))
        }

        return http
            .csrf().disable() // TODO: а может не надо? (вырубил, потому что не работает ajax POST)
            .addFilterAt(filter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build()
    }

    private fun generateNewUser(exchange: ServerWebExchange, tokenCookieKey: String): User {
        val token = UUID.randomUUID().toString()
        val user = User(UUID.randomUUID().toString(), generateUserName(), token)
        userDao().add(user)
        exchange.response.addCookie(ResponseCookie.from(tokenCookieKey, token).build())
        return user
    }

    @Bean
    fun userDao(): UserDao {
        return UserDao()
    }

}