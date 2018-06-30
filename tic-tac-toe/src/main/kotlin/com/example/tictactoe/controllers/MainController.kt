package com.example.tictactoe.controllers

import com.example.tictactoe.auth.User
import org.springframework.http.HttpEntity
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import reactor.core.publisher.Mono
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource


/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 24.06.18
 */
@Controller
@RequestMapping("/")
class MainController {
    @GetMapping("/", produces = ["text/html"])
    fun main(): ResponseEntity<Resource> {
        val resource = ClassPathResource("templates/main.html")
        return ResponseEntity.ok().body(resource);
    }
}