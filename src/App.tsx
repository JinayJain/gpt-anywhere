import Search from "./components/Search";
import { Box, Heading } from "@chakra-ui/react";
import ResponseBox from "./components/ResponseBox";
import useAI from "./hooks/useAI";
import { useState } from "react";
import { fillerMarkdown } from "./util/consts";
import { chatComplete } from "./util/openai";

function App() {
  const ai = useAI(import.meta.env.VITE_OPENAI_API_KEY);

  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const handleGenerate = async (prompt: string, temperature = 1.0) => {
    setLastPrompt(prompt);

    if (ai && prompt) {
      setIsLoading(true);

      try {
        setResponse("");

        // setResponse(fillerMarkdown);
        await chatComplete({
          prompt,
          onChunk(chunk) {
            setResponse((prev) => prev + chunk);
          },
          apiParams: {
            temperature,
          },
        });
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
        onClear={() => setResponse("")}
        onRegenerate={() => handleGenerate(lastPrompt, 1.5)}
        maxH="100%"
        overflow="auto"
        whiteSpace="pre-wrap"
        responseMarkdown={response}
      />
    </Box>
  );
}

export default App;
