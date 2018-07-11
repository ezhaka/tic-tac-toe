package com.example.tictactoe.controllers

import org.slf4j.LoggerFactory
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import reactor.core.publisher.Mono
import java.security.Principal

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 24.06.18
 */
@Controller
@RequestMapping("/")
class MainController {
    private val log = LoggerFactory.getLogger(this.javaClass)

    @GetMapping("/", produces = ["text/html"])
    fun main(principal: Mono<Principal>): ResponseEntity<Resource> {
        val resource = ClassPathResource("templates/main.html")
        return ResponseEntity.ok().body(resource)
    }

    // TODO: remove
    @GetMapping("/api/greet")
    fun greet(principal: Mono<Principal>): Mono<ResponseEntity<String>> {
        return principal
            .map { it.name }
            .map { name -> ResponseEntity.ok("Hello, $name") }
    }
}