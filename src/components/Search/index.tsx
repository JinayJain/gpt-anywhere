import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Configuration, OpenAIApi } from "openai";
import React, { useCallback, useMemo, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import useAI from "../../hooks/useAI";

function Search() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const ai = useAI(import.meta.env.VITE_OPENAI_API_KEY);

  const handleGenerate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (ai) {
        const response = await ai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a general purpose AI-assistant.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        setResponse(response.data.choices[0].message?.content || "");
        console.log(response);
      }
    },
    [ai, prompt]
  );

  return (
    <Box>
      {/* some inspiring text to let your creativity run wild (or similar and more concise) */}
      <form onSubmit={handleGenerate}>
        <Stack>
          <Input
            placeholder="Unleash your creativity"
            variant="filled"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            autoFocus
          />

          <Button
            alignSelf="center"
            colorScheme="blue"
            variant="outline"
            type="submit"
          >
            Generate
          </Button>
        </Stack>
      </form>

      <ReactMarkdown
        components={ChakraUIRenderer()}
        children={response}
        skipHtml
      />
    </Box>
  );
}

export default Search;
