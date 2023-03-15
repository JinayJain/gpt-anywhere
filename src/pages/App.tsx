import Search from "../components/Search";
import { Box, Heading, Text } from "@chakra-ui/react";
import ResponseBox from "../components/ResponseBox";
import { useState } from "react";
import { fillerMarkdown } from "../util/consts";
import { chatComplete } from "../util/openai";
import { AnimatePresence, motion } from "framer-motion";
import UnauthorizedErrorBox from "../components/UnauthorizedErrorBox";

const CLEAR_TEXT = "";
// const CLEAR_TEXT = fillerMarkdown;

function App() {
  const [response, setResponse] = useState(CLEAR_TEXT);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const handleGenerate = async (prompt: string, temperature = 1.0) => {
    setLastPrompt(prompt);

    if (prompt) {
      setError(null);
      setIsLoading(true);

      try {
        setResponse(CLEAR_TEXT);

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
        if (e instanceof Error) {
          setError(e);
        }

        console.log(e);
      }

      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" h="100vh">
      <Search onGenerate={handleGenerate} isLoading={isLoading} mb={4} />

      <AnimatePresence>
        {(error || response) && (
          <Box
            as={motion.div}
            bg="blackAlpha.800"
            borderRadius="md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            maxH="100%"
            overflow="auto"
          >
            {error ? (
              error.message === "Unauthorized" ? (
                <UnauthorizedErrorBox />
              ) : (
                <Box>
                  <Heading size="sm">
                    An error occurred while generating a response.
                  </Heading>

                  <Text>
                    Please try again. If the problem persists, please{" "}
                    <a href="https://github.com/jinayjain/gpt-anywhere/issues">
                      open an issue
                    </a>
                    .
                  </Text>
                </Box>
              )
            ) : (
              <ResponseBox
                onClear={() => setResponse(CLEAR_TEXT)}
                onRegenerate={() => handleGenerate(lastPrompt, 1.5)}
                responseMarkdown={response}
              />
            )}
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default App;
