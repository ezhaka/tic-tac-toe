package com.example.tictactoe.controllers

import com.example.tictactoe.auth.GameAuthentication
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import java.security.Principal
import javax.naming.AuthenticationException

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 05.07.18
 */
@RestController
@RequestMapping("/api/auth")
class AuthController {
    @PostMapping
    fun authenticate(principal: Mono<Principal>) = principal
        .map { it as GameAuthentication }
        .ofType(GameAuthentication::class.java)
        .map { UserDto(it.user) }
        .map { ok().body(it) }
        .switchIfEmpty(Mono.error(AuthenticationException("Principal is empty")))
}