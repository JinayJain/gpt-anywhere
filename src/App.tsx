import Search from "./components/Search";
import { Box, Heading } from "@chakra-ui/react";
import ResponseBox from "./components/ResponseBox";
import useAI from "./hooks/useAI";
import { useState } from "react";
import { fillerMarkdown } from "./util/consts";

function App() {
  const ai = useAI(import.meta.env.VITE_OPENAI_API_KEY);

  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (prompt: string) => {
    if (ai && prompt) {
      setIsLoading(true);

      try {
        const response = await ai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a concise AI assistant.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        setResponse(response.data.choices[0].message?.content || "");
        console.log(response);
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" h="100vh">
      <Search onGenerate={handleGenerate} isLoading={isLoading} mb={4} />
      <ResponseBox
        maxH="100%"
        overflow="auto"
        whiteSpace="pre-wrap"
        responseMarkdown={response}
      />
    </Box>
  );
}

export default App;
