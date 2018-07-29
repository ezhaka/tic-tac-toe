package com.example.tictactoe.auth

import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContext
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import java.util.UUID

const val TOKEN_COOKIE_PATTERN = "Token=.*?; Path=/; Max-Age=PT720H; Expires=.*?; HttpOnly"

@RunWith(SpringRunner::class)
@SpringBootTest
class SecurityConfigurationTest {
    @Autowired
    lateinit var context: ApplicationContext

    @Autowired
    lateinit var userDao: UserDao

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
            .expectHeader()
            .doesNotExist("Www-Authenticate")
    }

    @Test
    fun `authenticate request should set cookie`() {
        rest.post()
            .uri("/api/auth")
            .exchange()
            .expectStatus()
            .is2xxSuccessful
            .expectHeader()
            .valueMatches("Set-Cookie", TOKEN_COOKIE_PATTERN)
    }

    @Test
    fun `authenticated access is allowed to api`() {
        val user = userDao.createUser().block()!!

        rest.get()
            .uri("/api/boards")
            .cookie("Token", user.token)
            .exchange()
            .expectStatus()
            .is2xxSuccessful
            .expectHeader()
            .doesNotExist("Set-Cookie")
    }

    @Test
    fun `unknown user access is not allowed to api`() {
        rest.get()
            .uri("/api/boards")
            .cookie("Token", UUID.randomUUID().toString())
            .exchange()
            .expectStatus()
            .isUnauthorized
            .expectHeader()
            .doesNotExist("Set-Cookie")
    }

    @Test
    fun `authenticate request with unknown user should set new cookie`() {
        rest.post()
            .uri("/api/auth")
            .cookie("Token", UUID.randomUUID().toString())
            .exchange()
            .expectStatus()
            .is2xxSuccessful
            .expectHeader()
            .valueMatches("Set-Cookie", TOKEN_COOKIE_PATTERN)
    }
}