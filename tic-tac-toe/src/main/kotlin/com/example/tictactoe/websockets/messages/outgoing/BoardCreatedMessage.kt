package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.controllers.BoardDto
import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

class BoardCreatedMessage(val board: BoardDto) : Message(MessageType.BOARD_CREATED)