package com.example.tictactoe.auth

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.ServerAuthenticationEntryPoint
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.security.web.server.authentication.ServerAuthenticationEntryPointFailureHandler
import org.springframework.security.web.server.context.ServerSecurityContextRepository
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers
import reactor.core.publisher.Mono

const val AUTH_URL = "/api/auth"
const val TOKEN_COOKIE_KEY = "Token"

@EnableWebFluxSecurity
class SecurityConfiguration(private val userService: UserService) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        val securityContextRepository = TokenBasedSecurityContextRepository(userService)

        val authenticationEntryPoint = ServerAuthenticationEntryPoint { exchange, _ ->
            Mono.fromRunnable {
                exchange.response.statusCode = HttpStatus.UNAUTHORIZED
            }
        }

        val filter = authenticationWebFilter(securityContextRepository, authenticationEntryPoint)

        return http
            .securityContextRepository(securityContextRepository)
            .authorizeExchange()
            .pathMatchers(
                "/",
                AUTH_URL,
                "/boards/**",
                "/static/**",
                "/service-worker.js",
                "/favicon.ico",
                "/manifest.json"
            )
            .permitAll()
            .anyExchange().authenticated()
            .and()
            .httpBasic().disable()
            .formLogin().disable()
            .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint)
            .and()
            .csrf().disable()
            .addFilterAt(filter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build()
    }

    private fun authenticationWebFilter(
        securityContextRepository: ServerSecurityContextRepository,
        authenticationEntryPoint: ServerAuthenticationEntryPoint
    ): AuthenticationWebFilter {
        val filter = AuthenticationWebFilter { Mono.just(it) }

        filter.setSecurityContextRepository(securityContextRepository)

        filter.setAuthenticationConverter {
            ReactiveSecurityContextHolder.getContext()
                .filter { it.authentication !== null }
                .map { it.authentication }
                .switchIfEmpty(userService.createUser().map { GameAuthentication(it) })
        }

        filter.setRequiresAuthenticationMatcher(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, AUTH_URL))

        filter.setAuthenticationSuccessHandler { webFilterExchange, _ ->
            val exchange = webFilterExchange.exchange
            exchange.response.statusCode = HttpStatus.OK
            webFilterExchange.chain.filter(exchange)
        }

        filter.setAuthenticationFailureHandler(ServerAuthenticationEntryPointFailureHandler(authenticationEntryPoint))

        return filter
    }
}