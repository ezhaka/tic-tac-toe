package com.example.tictactoe.controllers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import reactor.core.publisher.Mono
import java.security.Principal

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 05.07.18
 */
@Controller
@RequestMapping("/api/auth")
class AuthController {
    @PostMapping
    fun authenticate(principal: Mono<Principal>) {

    }
}