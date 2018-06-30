package com.example.tictactoe.websockets

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 26.06.18
 */
class PingMessage(@JsonProperty("room") room: String, userId: String) : Message(MessageType.PING, userId) {
}