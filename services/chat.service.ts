import { apiClient } from "@/lib/apiClients";
import { ChatMessageDto, ChatReplyDto } from "@/types/chat.dto";

export const chatService = {
  async chat(message: ChatMessageDto) {
    return await apiClient<ChatReplyDto>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(message)
    });
  }
}