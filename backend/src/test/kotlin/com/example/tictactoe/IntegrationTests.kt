package com.example.tictactoe

import com.example.tictactoe.controllers.BoardDto
import com.example.tictactoe.controllers.PlayerDto
import com.example.tictactoe.controllers.UserDto
import com.example.tictactoe.model.CoordinateRange
import com.example.tictactoe.model.Coordinates
import com.example.tictactoe.model.Move
import com.example.tictactoe.model.PlayerIconType
import com.example.tictactoe.model.Winner
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.JoinBoardMessage
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage
import com.example.tictactoe.websockets.messages.outgoing.BoardCreatedMessage
import com.example.tictactoe.websockets.messages.outgoing.MoveMadeMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerJoinedMessage
import com.example.tictactoe.websockets.messages.outgoing.PlayerWonMessage
import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.Assertions.assertThat
import org.junit.Assert
import org.junit.Rule
import org.junit.Test
import org.junit.rules.Timeout
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpHeaders
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.socket.WebSocketMessage
import org.springframework.web.reactive.socket.WebSocketSession
import org.springframework.web.reactive.socket.client.ReactorNettyWebSocketClient
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono
import reactor.util.function.component1
import reactor.util.function.component2
import java.net.URI
import java.time.Instant
import java.util.regex.Pattern

@RunWith(SpringRunner::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IntegrationTests {

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @LocalServerPort
    private val port: String? = null

    @Rule
    @JvmField
    final val timeout = Timeout.seconds(30)

    @Test
    fun `single user makes a move`() {
        val client = AuthenticatedClient()
        val board = createBoard(client)

        val outgoingMessages = Flux.just(
            MakeMoveMessage(board.id, Coordinates(0, 0))
        )

        val expectedMessages = Flux.just(
            MoveMadeMessage(board.id, Move(client.user.id, Coordinates(0, 0)), boardVersion = 2)
        )

        client.openWebSocketConnection { session ->
            val outgoing = session.send(outgoingMessages.map { messageToJson(it) }.map(session::textMessage))

            val incoming = expectedMessages
                .zipWith(session.receive().map(this::parseSocketMessage))
                .doOnNext { (expected, actual) -> assertMessagesAreEqual(expected, actual) }

            outgoing.mergeWith(incoming.then()).then()
        }
            .block()
    }

    @Test
    fun `second user receives notification about board creation`() {
        val firstClient = AuthenticatedClient()
        val secondClient = AuthenticatedClient()

        secondClient.openWebSocketConnection { session ->
            createBoardAsync(firstClient)
                .zipWith(session.receive().map(this::parseSocketMessage).next())
                .doOnNext { (board, message) ->
                    Assert.assertEquals(BoardCreatedMessage(board), message)
                }
                .then()
        }
            .block()
    }

    @Test
    fun `first user receives notification about joined player`() {
        val firstClient = AuthenticatedClient()
        val secondClient = AuthenticatedClient()

        val board = createBoard(firstClient)

        firstClient.openWebSocketConnection { firstSession ->
            secondClient.openWebSocketConnection { secondSession ->
                val outgoingMessage = secondSession.send(
                    JoinBoardMessage(board.id)
                        .toMono()
                        .map { messageToJson(it) }
                        .map(secondSession::textMessage)
                )

                val incomingMessage = firstSession.receive()
                    .map(this::parseSocketMessage)
                    .doOnNext {
                        val expectedMessage =
                            PlayerJoinedMessage(
                                board.id,
                                PlayerDto(secondClient.user, PlayerIconType.HEDGEHOG),
                                boardVersion = 2
                            )

                        Assert.assertEquals(expectedMessage, it)
                    }
                    .take(1)

                outgoingMessage.concatWith(incomingMessage.then()).then()
            }
        }
            .block()
    }

    @Test
    fun `two player full game`() {
        val firstClient = AuthenticatedClient()
        val secondClient = AuthenticatedClient()

        val board = createBoard(firstClient)

        firstClient.openWebSocketConnection { firstSession ->
            secondClient.openWebSocketConnection { secondSession ->
                val movesList = listOf(
                    Pair(secondSession, JoinBoardMessage(board.id)),
                    Pair(firstSession, MakeMoveMessage(board.id, Coordinates(0, 0))),
                    Pair(secondSession, MakeMoveMessage(board.id, Coordinates(0, 1))),
                    Pair(firstSession, MakeMoveMessage(board.id, Coordinates(1, 0))),
                    Pair(secondSession, MakeMoveMessage(board.id, Coordinates(1, 1))),
                    Pair(firstSession, MakeMoveMessage(board.id, Coordinates(2, 0))),
                    Pair(secondSession, MakeMoveMessage(board.id, Coordinates(2, 1))),
                    Pair(firstSession, MakeMoveMessage(board.id, Coordinates(3, 0)))
                )

                val moves = Flux.fromIterable(movesList.drop(1))
                    .zipWith(firstSession.receive())
                    .map { (outgoingMessage, _) -> outgoingMessage }
                    .startWith(movesList[0])
                    .publish()
                    .refCount(2)

                val send: (WebSocketSession) -> Mono<Void> = { s ->
                    s.send(
                        moves
                            .filter { (session, _) -> session == s }
                            .map { (_, message) -> messageToJson(message) }
                            .map(s::textMessage)
                    )
                }

                Flux.merge(
                    send(firstSession),
                    send(secondSession),
                    secondSession.receive()
                        .map(this::parseSocketMessage)
                        .take(movesList.size.toLong())
                        .last()
                        .doOnNext {
                            val expectedMessage = PlayerWonMessage(
                                board.id,
                                Move(firstClient.user.id, Coordinates(3, 0)),
                                Winner(
                                    firstClient.user.id,
                                    listOf(
                                        CoordinateRange(
                                            Coordinates(0, 0),
                                            Coordinates(3, 0)
                                        )
                                    )
                                ),
                                boardVersion = 9
                            )

                            assertMessagesAreEqual(expectedMessage, it)
                        }
                        .then()
                ).then()
            }
        }
            .block()
    }

    private fun parseSocketMessage(message: WebSocketMessage) = messageFromJson(message.payloadAsText)

    private fun createBoardAsync(client: AuthenticatedClient) = client.webClient
        .post()
        .uri("/api/boards")
        .retrieve()
        .bodyToMono(BoardDto::class.java)

    private fun createBoard(client: AuthenticatedClient) = createBoardAsync(client).block()!!

    private fun assertMessagesAreEqual(
        expected: Message,
        actual: Message
    ) {
        val moveComparator: (Move, Move) -> Int =
        // TODO: strange place, I need to understand why assertj uses comparators, it's so inconvenient!
            { x, y -> if (x.copy(date = Instant.EPOCH) == y.copy(date = Instant.EPOCH)) 0 else -1 }

        assertThat(actual)
            .usingComparatorForType(moveComparator, Move::class.java)
            .isEqualToComparingFieldByFieldRecursively(expected)
    }

    inner class AuthenticatedClient {
        val token: String
        val user: UserDto
        val webClient: WebClient

        init {
            val (user, token) = getToken()
            this.user = user
            this.token = token
            this.webClient = getWebClient(token)
        }

        fun openWebSocketConnection(handler: (WebSocketSession) -> Mono<Void>): Mono<Void> {
            val webSocketClient = ReactorNettyWebSocketClient()
            val headers = HttpHeaders()
            headers["Cookie"] = "Token=$token"

            return webSocketClient.execute(URI("ws://localhost:$port/websocket"), headers, handler)
        }

        private fun getWebClient(token: String) = WebClient.builder()
            .baseUrl(getHttpUrl())
            .defaultCookie("Token", token)
            .build()

        private fun getToken(): Pair<UserDto, String> {
            val webClient = WebClient.builder()
                .baseUrl(getHttpUrl())
                .build()

            val authResponse = webClient.post()
                .uri("/api/auth")
                .exchange()
                .block()!!

            val user = authResponse.bodyToMono(UserDto::class.java).block()!!

            val tokenPattern = Pattern.compile("Token=(.*?);.*")
            val setCookieHeader = authResponse.headers().header("Set-Cookie").first()
            val matcher = tokenPattern.matcher(setCookieHeader)
            Assert.assertTrue(matcher.matches())

            return Pair(user, matcher.group(1))
        }
    }

    private fun getHttpUrl() = "http://localhost:$port"

    private fun messageToJson(message: Message) = objectMapper.writeValueAsString(message)

    private fun messageFromJson(s: String) = objectMapper.readValue(s, Message::class.java)
}