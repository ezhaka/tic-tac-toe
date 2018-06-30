package com.example.tictactoe.controllers

import com.example.tictactoe.auth.GameAuthentication
import com.example.tictactoe.auth.User
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 24.06.18
 */
@RestController
@RequestMapping("/user")
class UserController {
    @GetMapping("/current")
    fun current(): Mono<User> {
        val authentication = SecurityContextHolder.getContext().authentication as GameAuthentication?
        return if (authentication !== null) Mono.just(authentication.user) else Mono.empty()
    }
}