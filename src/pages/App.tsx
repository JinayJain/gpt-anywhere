import Search from "../components/Search";
import { Box } from "@chakra-ui/react";
import ResponseBox from "../components/ResponseBox";
import { useState } from "react";
import { fillerMarkdown } from "../util/consts";
import { chatComplete } from "../util/openai";

const CLEAR_TEXT = "";
// const CLEAR_TEXT = fillerMarkdown;

function App() {
  const [response, setResponse] = useState(CLEAR_TEXT);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const handleGenerate = async (prompt: string, temperature = 1.0) => {
    setLastPrompt(prompt);

    if (prompt) {
      setIsLoading(true);

      try {
        setResponse(CLEAR_TEXT);

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
        onClear={() => setResponse(CLEAR_TEXT)}
        onRegenerate={() => handleGenerate(lastPrompt, 1.5)}
        maxH="100%"
        overflow="auto"
        responseMarkdown={response}
      />
    </Box>
  );
}

export default App;
