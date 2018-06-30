package com.example.tictactoe.websockets

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 30.06.18
 */
class PlayerDisconnectedMessage(userId: String) : Message(MessageType.PLAYER_DISCONNECTED, userId)