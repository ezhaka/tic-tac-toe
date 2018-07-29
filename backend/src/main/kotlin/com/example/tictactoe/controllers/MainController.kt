package com.example.tictactoe.controllers

import org.slf4j.LoggerFactory
import org.springframework.core.io.ClassPathResource
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

const val TEXT_HTML = "text/html"

@Controller
@RequestMapping("/")
class MainController {
    private val log = LoggerFactory.getLogger(this.javaClass)

    @GetMapping("/", produces = [TEXT_HTML])
    fun main() = mainPage()

    @GetMapping("/boards/{id}", produces = [TEXT_HTML])
    fun boardDetails() = mainPage()

    private fun mainPage() = ResponseEntity.ok().body(ClassPathResource("web/index.html"))
}