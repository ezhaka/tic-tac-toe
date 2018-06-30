package com.example.tictactoe.controllers

import com.example.tictactoe.model.Board
import com.example.tictactoe.model.BoardAlreadyExistsException
import com.example.tictactoe.model.BoardProvider
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.*
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 30.06.18
 */
@RestController
@RequestMapping("/api/board")
class BoardController(val boardProvider: BoardProvider) {
    @GetMapping("/{id}")
    fun getById(@PathVariable id: String) = boardProvider.getById(id)
        .map { ok().body(it) }
        .defaultIfEmpty(notFound().build())

    @PostMapping
    fun post(@RequestBody board: Board) = boardProvider.create(board)
        .map { ok().build<Void>() }
        .onErrorResume {
            when (it) {
                is BoardAlreadyExistsException -> Mono.just(status(HttpStatus.CONFLICT).build<Void>())
                else -> Mono.error(it)
            }
        }
}