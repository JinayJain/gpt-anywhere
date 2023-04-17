import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { CreateChatCompletionRequest } from "openai";
import {
  SYSTEM_PROMPT,
  DEFAULT_MAX_TOKENS,
  STORE_KEY,
  DEFAULT_TIMEOUT,
} from "./consts";
import { ChatMessage } from "./hooks/useChatLog";
import store from "./store";

type ApiParams = Omit<
  CreateChatCompletionRequest,
  "model" | "messages" | "stream"
>;

async function processLine(line: string) {
  const sliced = line.slice(6).trim();

  if (sliced === "[DONE]") {
    return {
      done: true,
    };
  }

  const data = JSON.parse(sliced);
  const msg: string = data?.choices?.[0]?.delta?.content;

  if (msg) {
    return {
      done: false,
      message: msg,
    };
  }

  return {
    done: false,
  };
}

async function sendApiRequest(
  chat: ChatMessage[],
  controller: AbortController,
  apiParams?: ApiParams
) {
  // const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const apiKey = await store.get(STORE_KEY.API_KEY);
  const max_tokens =
    Number(await store.get(STORE_KEY.MAX_TOKENS)) || DEFAULT_MAX_TOKENS;

  const { signal } = controller;

  const apiChat = chat.map((msg) => ({
    role: msg.type === "prompt" ? "user" : "system",
    // TypeScript doesn't infer that msg isn't an error
    content: msg.text,
  }));

  let response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "text/event-stream",
    },
    signal,
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...apiChat,
      ],
      stream: true,
      max_tokens,
      ...apiParams,
    }),
  });
  return response
}

async function sendApiRequestNgepet(
  chat: ChatMessage[],
  controller: AbortController,
  apiParams?: ApiParams
) {
  // const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const tokenAPINgepet = await store.get(STORE_KEY.API_KEY);
  const userDetails = await store.get(STORE_KEY.USER);
  const max_tokens =
    Number(await store.get(STORE_KEY.MAX_TOKENS)) || DEFAULT_MAX_TOKENS;

  const { signal } = controller;

  const apiChat = chat.map((msg) => ({
    role: msg.type === "prompt" ? "user" : "system",
    // TypeScript doesn't infer that msg isn't an error
    content: msg.text,
  }));

  let prompts = chat?.filter((c) => c?.type === 'prompt')
  let params = {
    // message: chat?.[0]?.text,
    message: prompts?.[prompts?.length - 1]?.text,
  };
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM5MDBkMGY5LTJkNjEtNDQ5NC05N2Q0LTRhMzZmY2NhOGY2ZCIsImlhdCI6MTY4MDc2MTY2MCwiZXhwIjoxNjgwNzY1MjYwfQ.CQ3lKGAy3cmzQEUBThUJcXVXEUibaVY0CM8B0hYJwyw"

  let response = await fetch("http://52.77.54.192:4000/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + tokenAPINgepet,
    },
    signal,
    body: JSON.stringify(params),
  });
  const data = await response.json();
  return data;
}

async function processBody(
  reader: ReadableStreamDefaultReader,
  onChunk: (message: string) => void
) {
  let done, value;
  let data = "";
  let finalMessage = "";
  while (!done) {
    ({ value, done } = await reader.read());
    // parse value
    const text = new TextDecoder("utf-8").decode(value);
    // split lines but keep the delimiter by \r or \n or \r\n
    const lines = text.split(/(\n|\r|\r\n)/g);
    console.log('lines', lines)

    for (const line of lines) {
      data += line;

      const regex = /(\r\r|\n\n|\r\n\r\n)$/;

      if (regex.test(data)) {
        const { done, message } = await processLine(data);

        if (done) {
          break;
        }

        if (message) {
          finalMessage += message;
          onChunk(message);
        }

        data = "";
      }
    }
  }

  console.log(finalMessage);
  return finalMessage;
}

async function chatComplete({
  chat,
  onChunk,
  apiParams,
}: {
  chat: ChatMessage[];
  onChunk: (message: string) => void;
  apiParams?: ApiParams;
}) {
  const controller = new AbortController();

  console.log("sending request");

  const timeoutSec =
    Number(await store.get(STORE_KEY.TIMEOUT)) || DEFAULT_TIMEOUT;

  const handle = setTimeout(() => {
    console.log("timeout fired");
    controller.abort();
  }, timeoutSec * 1000);

  // const res = await sendApiRequest(chat, controller, apiParams);
  const res = await sendApiRequestNgepet(chat, controller, apiParams);
  console.log('res api aldi', res)

  if (!(res.statusCode >= 200 && res.statusCode <= 300)) {
    if (res.statusCode === 401) {
      throw new Error("Unauthorized");
    }

    throw new Error("Unknown error");
  }

  if (!res?.data?.completion?.message) {
    throw new Error("Error");
  }

  // const reader = res.body.getReader();

  const handleChunk = (message: string) => {
    clearTimeout(handle);
    onChunk(message);
  };
  handleChunk(res?.data?.completion?.message)
  return res?.data?.completion?.message
  // return await processBody(reader, handleChunk);
}

export { chatComplete };
