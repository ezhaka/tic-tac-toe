package com.example.tictactoe.controllers

import com.example.tictactoe.auth.GameAuthentication
import com.example.tictactoe.auth.UserDao
import com.example.tictactoe.model.Board
import com.example.tictactoe.model.BoardAlreadyExistsException
import com.example.tictactoe.model.BoardProvider
import com.example.tictactoe.websockets.MessageBus
import com.example.tictactoe.websockets.messages.outgoing.BoardCreatedMessage
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity.*
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.security.Principal
import java.util.*

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 30.06.18
 */
@RestController
@RequestMapping("/api/boards")
class BoardController(val boardProvider: BoardProvider, val userDao: UserDao, val messageBus: MessageBus) {
    @GetMapping
    fun get(): Flux<BoardDto> {
        return boardProvider.getActive()
            .map(this::convertToBoardDto)
    }

    @PostMapping
    fun post(@RequestBody builder: Board.Builder, principal: Mono<Principal>) = principal
        .map { it as GameAuthentication }
        .flatMap {
            boardProvider.create(Board(id = UUID.randomUUID().toString()).addPlayer(it.user.id))
        }
        .map { convertToBoardDto(it) }
        .doOnNext { messageBus.notifySubscribers(BoardCreatedMessage(it)) }
        .map { ok().body(it) }
        .onErrorResume {
            when (it) {
                is BoardAlreadyExistsException -> Mono.just(
                    status(HttpStatus.CONFLICT).build<BoardDto>()
                )
                else -> Mono.error(it)
            }
        }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String) = boardProvider.getById(id)
        .map { ok().body(convertToBoardDto(it)) }
        .defaultIfEmpty(notFound().build())

    private fun convertToBoardDto(board: Board): BoardDto {
        val users = userDao.getUsers(board.players.map { it.userId })
        return createBoardDto(board, users)
    }
}