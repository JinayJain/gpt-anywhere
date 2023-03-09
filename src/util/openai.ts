import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { CreateChatCompletionRequest } from "openai";
import { SYSTEM_PROMPT, MAX_TOKENS, STORE_KEY } from "./consts";
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

async function sendApiRequest(prompt: string, apiParams?: ApiParams) {
  // const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const OPENAI_API_KEY = await store.get(STORE_KEY.API_KEY);

  return await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: MAX_TOKENS,
      ...apiParams,
    }),
  });
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

  return finalMessage;
}

async function chatComplete({
  prompt,
  onChunk,
  apiParams,
}: {
  prompt: string;
  onChunk: (message: string) => void;
  apiParams?: ApiParams;
}) {
  const res = await sendApiRequest(prompt, apiParams);

  if (!res.body) {
    throw new Error("No body");
  }

  const reader = res.body.getReader();
  return await processBody(reader, onChunk);
}

export { chatComplete };
