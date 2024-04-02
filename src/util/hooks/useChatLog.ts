import { useState } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

function useChatLog() {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setChatLog((chatLog) => [...chatLog, message]);
  };

  const addUser = (text: string) => {
    addMessage({ role: "user", text });
  };

  const addAssistant = (text: string) => {
    addMessage({ role: "assistant", text });
  };

  const clearChatLog = () => {
    setChatLog([]);
  };

  return {
    chatLog,
    addUser,
    addAssistant,
    clearChatLog,
  };
}

export default useChatLog;
