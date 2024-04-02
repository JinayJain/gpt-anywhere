import Anthropic from "@anthropic-ai/sdk";
import { Message } from "./ai";
import {
  SYSTEM_PROMPT,
  DEFAULT_MAX_TOKENS,
  STORE_KEY,
  DEFAULT_TIMEOUT,
} from "./consts";
import store from "./store";

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

type SendRequestFn = (
  chat: Message[],
  controller: AbortController,
  model: string
) => Promise<Response>;

const sendOpenAiApiRequest: SendRequestFn = async (chat, controller, model) => {
  const apiKey = await store.get(STORE_KEY.OPENAI_API_KEY);
  const max_tokens =
    Number(await store.get(STORE_KEY.MAX_TOKENS)) || DEFAULT_MAX_TOKENS;

  const { signal } = controller;

  const apiChat = chat.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  return await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "text/event-stream",
    },
    signal,
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...apiChat,
      ],
      stream: true,
      max_tokens,
    }),
  });
};

// const sendAnthropicApiRequest: SendRequestFn = async (
//   chat,
//   controller,
//   model
// ) => {
//   const apiKey = (await store.get(STORE_KEY.ANTHROPIC_API_KEY)) as string;
//   const max_tokens =
//     Number(await store.get(STORE_KEY.MAX_TOKENS)) || DEFAULT_MAX_TOKENS;

//   const { signal } = controller;

//   const apiChat = chat.map((msg) => ({
//     role: msg.role,
//     content: msg.content,
//   }));
//   console.log(apiKey);

//   const anthropic = new Anthropic({
//     apiKey,
//   });

//   // const message = await anthropic.messages.create({
//   //   max_tokens: 1024,
//   //   messages: [{ role: "user", content: "Hello, Claude" }],
//   //   model: "claude-3-sonnet-20240229",
//   // });

//   // console.log(message.content);

//   // return await sendOpenAiApiRequest(chat, controller, model);
//   return await fetch("https://api.anthropic.com/v1/messages", {
//     method: "POST",
//     mode: "cors",
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "x-api-key": apiKey,
//       "anthropic-version": "2023-06-01",
//       "anthropic-beta": "messages-2023-12-15",
//       "content-type": "application/json",
//     },
//     signal,
//     body: JSON.stringify({
//       model,
//       system: SYSTEM_PROMPT,
//       messages: apiChat,
//       stream: true,
//       max_tokens,
//     }),
//   });
// };

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

  console.log(finalMessage);
  return finalMessage;
}

async function chatComplete({
  chat,
  onChunk,
  model,
}: {
  chat: Message[];
  onChunk: (message: string) => void;
  model: string;
}) {
  const controller = new AbortController();

  const timeoutSec =
    Number(await store.get(STORE_KEY.TIMEOUT)) || DEFAULT_TIMEOUT;

  const handle = setTimeout(() => {
    controller.abort();
  }, timeoutSec * 1000);

  const res = await sendOpenAiApiRequest(chat, controller, model);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }

    throw new Error("Unknown error");
  }

  if (!res.body) {
    throw new Error("No body");
  }

  const reader = res.body.getReader();

  const handleChunk = (message: string) => {
    clearTimeout(handle);
    onChunk(message);
  };

  return await processBody(reader, handleChunk);
}

export { chatComplete };
