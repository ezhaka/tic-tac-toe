package com.example.tictactoe.controllers

import com.example.tictactoe.auth.UserDao
import com.example.tictactoe.model.Board
import com.example.tictactoe.model.BoardAlreadyExistsException
import com.example.tictactoe.model.BoardProvider
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity.*
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 30.06.18
 */
@RestController
@RequestMapping("/api/boards")
class BoardController(val boardProvider: BoardProvider, val userDao: UserDao) {
    @GetMapping
    fun get(): Flux<BoardDto> {
        return boardProvider.getActive()
            .map(this::convertToBoardDto)
    }

    @PostMapping
    fun post(@RequestBody builder: Board.Builder) = boardProvider.create(builder.build())
        .map { ok().body(it) }
        .onErrorResume {
            when (it) {
                is BoardAlreadyExistsException -> Mono.just(
                    status(HttpStatus.CONFLICT).build<Board>()
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