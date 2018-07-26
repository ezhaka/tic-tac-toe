package com.example.tictactoe

import com.example.tictactoe.controllers.BoardDto
import com.example.tictactoe.controllers.UserDto
import com.example.tictactoe.model.Coordinates
import com.example.tictactoe.model.Move
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.incoming.MakeMoveMessage
import com.example.tictactoe.websockets.messages.messageFromJson
import com.example.tictactoe.websockets.messages.outgoing.MoveMadeMessage
import com.example.tictactoe.websockets.messages.toJson
import org.assertj.core.api.Assertions.assertThat
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpHeaders
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.socket.WebSocketSession
import org.springframework.web.reactive.socket.client.ReactorNettyWebSocketClient
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.util.function.component1
import reactor.util.function.component2
import java.net.URI
import java.time.Instant
import java.util.regex.Pattern

@RunWith(SpringRunner::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IntegrationTests {

    @LocalServerPort
    private val port: String? = null

    @Test(timeout = 30_000)
    fun `single user makes a move`() {
        val (user, token) = getToken()
        val webClient = getWebClient(token)

        val board = webClient.post()
            .uri("/api/boards")
            .retrieve()
            .bodyToMono(BoardDto::class.java)
            .block()!!

        val outgoingMessages = Flux.just(
            MakeMoveMessage(board.id, Coordinates(0, 0))
        )

        val expectedMessages: Flux<Message> = Flux.just(
            MoveMadeMessage(board.id, Move(user.id, Coordinates(0, 0)))
        )

        openWebSocketConnection(token) { session ->
            Flux
                .merge(
                    Flux
                        .zip(expectedMessages, session.receive().map { messageFromJson(it.payloadAsText) })
                        .doOnNext { (expected, actual) -> assertMessagesAreEqual(expected, actual) },
                    session.send(outgoingMessages.map { it.toJson() }.map(session::textMessage))
                )
                .then()
        }
            .block()
    }

    private fun assertMessagesAreEqual(
        expected: Message,
        actual: Message
    ) {
        val moveComparator: (Move, Move) -> Int =
            { x, y -> if (x.copy(date = Instant.EPOCH) == y.copy(date = Instant.EPOCH)) 0 else -1 }

        assertThat(actual)
            .usingComparatorForType(moveComparator, Move::class.java)
            .isEqualToComparingFieldByFieldRecursively(expected)
    }

    private fun getWebClient(token: String): WebClient {
        return WebClient.builder()
            .baseUrl(getHttpUrl())
            .defaultCookie("Token", token)
            .build()
    }

    private fun openWebSocketConnection(
        token: String,
        handler: (WebSocketSession) -> Mono<Void>
    ): Mono<Void> {
        val webSocketClient = ReactorNettyWebSocketClient()
        val headers = HttpHeaders()
        headers["Cookie"] = "Token=$token"

        return webSocketClient.execute(URI("ws://localhost:$port/websocket"), headers, handler)
    }

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

    private fun getHttpUrl() = "http://localhost:$port"
}