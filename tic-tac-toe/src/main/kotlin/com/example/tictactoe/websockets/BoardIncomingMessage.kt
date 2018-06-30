package com.example.tictactoe.websockets

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 29.06.18
 */
abstract class BoardIncomingMessage(val boardId: String, type: MessageType, userId: String?) : Message(type, userId)