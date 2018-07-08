package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 30.06.18
 */
class PlayerDisconnectedMessage() : Message(MessageType.PLAYER_DISCONNECTED)