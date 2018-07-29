package com.example.tictactoe.controllers

import com.example.tictactoe.auth.GameAuthentication
import com.example.tictactoe.auth.UserService
import com.example.tictactoe.model.Board
import com.example.tictactoe.model.BoardService
import com.example.tictactoe.websockets.MessageBus
import com.example.tictactoe.websockets.messages.outgoing.BoardCreatedMessage
import org.springframework.http.ResponseEntity.notFound
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.security.Principal

@RestController
@RequestMapping("/api/boards")
class BoardController(val boardService: BoardService, val userService: UserService, val messageBus: MessageBus) {
    @GetMapping
    fun get(): Flux<BoardDto> {
        return boardService.getActive().flatMap(this::convertToBoardDto)
    }

    @PostMapping
    fun post(principal: Mono<Principal>) = principal
        .map { it as GameAuthentication }
        .flatMap { boardService.create(it.user.id) }
        .flatMap { convertToBoardDto(it) }
        .doOnNext { messageBus.onOutgoingMessage(BoardCreatedMessage(it)) }
        .map { ok().body(it) }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Int) = boardService.getById(id)
        .flatMap { convertToBoardDto(it) }
        .map { ok().body(it) }
        .defaultIfEmpty(notFound().build())

    private fun convertToBoardDto(board: Board): Mono<BoardDto> {
        return userService.getUsers(board.players.map { it.userId }).collectList().map { createBoardDto(board, it) }
    }
}