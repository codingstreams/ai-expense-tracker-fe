interface ChatSession {
  seesionId: string;
}

export interface ChatMessageDto extends ChatSession {
  message: string;

}

export interface ChatReplyDto extends ChatSession {
  reply: string;
}