package com.example.tictactoe.websockets

import com.fasterxml.jackson.annotation.JsonProperty

class SwitchRoomMessage(
    @JsonProperty("room") room: String,
    userId: String
) : Message(MessageType.SWITCH_ROOM, userId)