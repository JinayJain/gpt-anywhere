import { useState } from "react";

export type ChatMessage = {
  type: "prompt" | "response";
  text: string;
};

function useChatLog() {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  console.log('useChatLog', chatLog)

  const addMessage = (message: ChatMessage) => {
    setChatLog((chatLog) => [...chatLog, message]);
  };

  const addPrompt = (text: string) => {
    addMessage({ type: "prompt", text });
  };

  const addResponse = (text: string) => {
    addMessage({ type: "response", text });
  };

  const clearChatLog = () => {
    setChatLog([]);
  };

  const popChatLog = () => {
    // setChatLog(chatLog.pop());
  };

  return {
    chatLog,
    addPrompt,
    addResponse,
    clearChatLog,
    popChatLog,
  };
}

export default useChatLog;
