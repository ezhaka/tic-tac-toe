package com.example.tictactoe.websockets

import com.example.tictactoe.auth.User
import com.example.tictactoe.controllers.PlayerDto
import com.example.tictactoe.model.BoardService
import com.example.tictactoe.model.Move
import com.example.tictactoe.websockets.messages.incoming.IncomingMessageVisitor
import com.example.tictactoe.websockets.messages.incoming.JoinBoardMessage
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage
import com.example.tictactoe.websockets.messages.incoming.PingMessage
import com.example.tictactoe.websockets.messages.outgoing.MoveMadeMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerJoinedMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerWonMessage
import com.example.tictactoe.websockets.messages.outgoing.VersionedMessage
import reactor.core.publisher.Mono

class IncomingMessageHandler(
    private val user: User,
    private val boardService: BoardService
) : IncomingMessageVisitor<Mono<VersionedMessage>> {
    override fun visit(message: PingMessage): Mono<VersionedMessage> = Mono.empty()

    override fun visit(message: MakeMoveMessage): Mono<VersionedMessage> {
        val move = Move(user.id, message.coordinates)

        return boardService.getById(message.boardId)
            .flatMap { boardService.save(it.makeMove(move)) }
            .map {
                if (it.winner != null) {
                    PlayerWonMessage(message.boardId, move, it.winner, it.version)
                } else {
                    MoveMadeMessage(message.boardId, move, it.version)
                }
            }
    }

    override fun visit(message: JoinBoardMessage): Mono<VersionedMessage> {
        return boardService.getById(message.boardId)
            .flatMap {
                if (!it.hasPlayer(user.id)) Mono.just(it.addPlayer(user.id)) else Mono.empty()
            }
            .flatMap { board ->
                boardService.save(board)
            }
            .map {
                PlayerJoinedMessage(
                    message.boardId,
                    PlayerDto(it.getPlayer(user.id), user),
                    it.version
                )
            }
    }
}