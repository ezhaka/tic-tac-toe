package com.example.tictactoe.websockets.messages.outgoing

import com.example.tictactoe.websockets.messages.Message
import com.example.tictactoe.websockets.messages.MessageType

class PlayerDisconnectedMessage() : Message(MessageType.PLAYER_DISCONNECTED)