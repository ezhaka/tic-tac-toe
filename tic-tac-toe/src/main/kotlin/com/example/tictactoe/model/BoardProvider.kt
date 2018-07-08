package com.example.tictactoe.model

import com.example.tictactoe.websockets.MessageBus
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 27.06.18
 */
@Component
class BoardProvider() {
    private val map: ConcurrentHashMap<String, Board> = ConcurrentHashMap()

    fun getById(boardId: String): Mono<Board> {
        return Mono.justOrEmpty(map[boardId])
    }

    fun getByIdOrDefault(boardId: String): Mono<Board> {
        return getById(boardId).defaultIfEmpty(Board(boardId, emptyList(), emptySet()))
    }

    fun update(board: Board): Mono<Void> {
        // TODO: проверить, что такая борда уже есть
        map[board.id] = board
        return Mono.empty()
    }

    fun create(board: Board): Mono<Board> {
        if (map.containsKey(board.id)) {
            return Mono.error(BoardAlreadyExistsException(board.id))
        }

        map[board.id] = board
        return Mono.just(board)
    }

    fun getActive() = Flux.fromStream(
        map.values.stream()
            .filter { !it.isFinished }
            .sorted(Comparator.comparing<Board, Instant> { it.createdDate }.reversed())
    )
}