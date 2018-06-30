package com.example.tictactoe.controllers

import com.example.tictactoe.model.Board
import com.example.tictactoe.model.BoardProvider
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.notFound
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 30.06.18
 */
@RestController
@RequestMapping("/board")
class BoardController(val boardProvider: BoardProvider) {
    @GetMapping("/{id}")
    @ResponseBody
    fun getById(@PathVariable id: String): Mono<ResponseEntity<Board>> {
        return boardProvider.getById(id)
            .map { ok().body(it) }
            .defaultIfEmpty(notFound().build())
    }
}