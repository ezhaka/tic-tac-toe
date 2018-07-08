package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.controllers.BoardDto
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

/**
 * @author Anton Sukhonosenko <a href="mailto:algebraic@yandex-team.ru"></a>
 * @date 08.07.18
 */
class BoardCreatedMessage(val board: BoardDto) : Message(MessageType.BOARD_CREATED)