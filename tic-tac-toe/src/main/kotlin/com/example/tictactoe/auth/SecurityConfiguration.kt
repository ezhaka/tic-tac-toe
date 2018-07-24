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
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository
import org.springframework.security.web.server.util.matcher.AndServerWebExchangeMatcher
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers
import reactor.core.publisher.Mono
import java.util.UUID

const val AUTH_URL = "/api/auth"

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 23.06.18
 */
@EnableWebFluxSecurity
class SecurityConfiguration {
    private val log = LoggerFactory.getLogger(this.javaClass)

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        val securityContextRepository = WebSessionServerSecurityContextRepository()
        val filter = AuthenticationWebFilter {
            it.isAuthenticated = true
            Mono.just(it)
        } // TODO: надо проверять, что у нас такой юзер и правда есть

        filter.setAuthenticationConverter { exchange ->
            ReactiveSecurityContextHolder.getContext()
                .filter { it.authentication !== null }
                .map { it.authentication }
                .switchIfEmpty(
                    Mono.just(GameAuthentication(User(UUID.randomUUID().toString(), generateUserName(), "")))
                        .doOnNext { log.info("New user generated: ${it.user}") } // TODO: remove
                )
        }

        filter.setRequiresAuthenticationMatcher(
            AndServerWebExchangeMatcher(
                ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, AUTH_URL)
//                ServerWebExchangeMatcher { _ ->
//                    ReactiveSecurityContextHolder.getContext()
//                        .filter { it.authentication !== null }
//                        .flatMap { ServerWebExchangeMatcher.MatchResult.notMatch() }
//                        .switchIfEmpty(ServerWebExchangeMatcher.MatchResult.match())
//                }
            )
        )

        filter.setSecurityContextRepository(securityContextRepository)

        filter.setAuthenticationSuccessHandler { webFilterExchange, authentication ->
            val response = webFilterExchange.exchange.response
            response.statusCode = HttpStatus.OK
            userDao().add((authentication as GameAuthentication).user) // TODO: некрасивый каст
            val exchange = webFilterExchange.exchange
            webFilterExchange.chain.filter(exchange)
        }

        return http
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
            .anyExchange()
            .authenticated()
            .and()
            .csrf().disable() // TODO: а может не надо? (вырубил, потому что не работает ajax POST)
            .addFilterAt(filter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build()
    }

    @Bean
    fun userDao(): UserDao {
        return UserDao()
    }
}