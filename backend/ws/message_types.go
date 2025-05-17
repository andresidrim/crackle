package ws

type IncomingMessage struct {
	Type   string `json:"type"`
	Secret string `json:"secret,omitempty"`
	Guess  string `json:"guess,omitempty"`
}

type OutgoingMessage struct {
	Type string `json:"type"`
	Data any    `json:"data,omitempty"`
}

type GameOverPayload struct {
	Winner string `json:"winner"`
}

type GuessResultPayload struct {
	Correct       bool   `json:"correct"`
	Guess         string `json:"guess"`
	CorrectDigits uint8  `json:"correctDigits"`
}

type OpponentGuessedPayload struct {
	Guess         string `json:"guess"`
	CorrectDigits uint8  `json:"correctDigits"`
}

type ErrorMessage struct {
	Message string `json:"message"`
}
