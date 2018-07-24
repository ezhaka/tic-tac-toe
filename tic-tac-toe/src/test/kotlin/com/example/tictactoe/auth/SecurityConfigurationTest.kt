package com.example.tictactoe.auth

import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContext
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient

@RunWith(SpringRunner::class)
@SpringBootTest
class SecurityConfigurationTest {
    @Autowired
    lateinit var context: ApplicationContext

    lateinit var rest: WebTestClient

    @Before
    fun setup() {
        rest = WebTestClient
            .bindToApplicationContext(this.context)
            .configureClient()
            .build()
    }

    @Test
    fun `unauthenticated access is allowed to the root path`() {
        rest.get()
            .uri("/")
            .exchange()
            .expectStatus()
            .is2xxSuccessful
    }

    @Test
    fun `unauthenticated access is not allowed to api`() {
        rest.get()
            .uri("/api/boards")
            .exchange()
            .expectStatus()
            .isUnauthorized
    }

    @Test
    fun `authenticate request should set cookie`() {
        rest.post()
            .uri("/api/auth")
            .exchange()
            .expectStatus()
            .is2xxSuccessful
            .expectHeader()
            .valueMatches("Set-Cookie", "SESSION=.*?; Path=/; HttpOnly")
    }
}