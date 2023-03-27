import Search from "../components/Search";
import { Box, Button, Center } from "@chakra-ui/react";
import ResponseBox from "../components/ResponseBox";
import { useState } from "react";
import { chatComplete } from "../util/openai";
import { AnimatePresence, motion } from "framer-motion";
import UnauthorizedErrorBox from "../components/UnauthorizedErrorBox";
import ErrorBox from "../components/ErrorBox";
import PromptBox from "../components/PromptBox";
import useChatLog, { ChatMessage } from "../util/hooks/useChatLog";
import { NotAllowedIcon, RepeatIcon } from "@chakra-ui/icons";

const CLEAR_TEXT = "";
// const CLEAR_TEXT = fillerMarkdown;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [bgClicked, setBgClicked] = useState(false);
  const { chatLog, addPrompt, addResponse, clearChatLog } = useChatLog();
  const [error, setError] = useState<Error | null>(null);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    setBgClicked(true);
    setTimeout(() => {
      setBgClicked(false);
    }, 200);
  };

  const handleGenerate = async (prompt: string, temperature = 1.0) => {
    if (prompt) {
      const chatHistory: ChatMessage[] = [
        ...chatLog,
        { type: "prompt", text: prompt },
      ];

      addPrompt(prompt);
      setError(null);
      setIsLoading(true);

      try {
        const response = await chatComplete({
          chat: chatHistory,
          onChunk(chunk) {},
          apiParams: {
            temperature,
          },
        });

        addResponse(response);
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
    <Box
      display="flex"
      flexDirection="column"
      h="100vh"
      bg={bgClicked ? "blackAlpha.300" : "none"}
      onClick={handleBgClick}
      transition="background-color 0.1s ease"
      rounded="md"
    >
      <Search
        onGenerate={handleGenerate}
        onClear={clearChatLog}
        isLoading={isLoading}
        mb={2}
      />

      <Box overflowY="auto" maxH="100%">
        <AnimatePresence>
          {error && (
            <Box
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              mb={2}
              rounded="md"
              overflow="hidden"
              background="blackAlpha.800"
            >
              {error.message === "Unauthorized" ? (
                <UnauthorizedErrorBox />
              ) : (
                <ErrorBox error={error} />
              )}
            </Box>
          )}

          {[...chatLog]
            .map((message, i) => (
              <Box
                key={i}
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                mt={i === chatLog.length - 1 ? 0 : 2}
              >
                {message.type === "prompt" ? (
                  <PromptBox prompt={message.text} />
                ) : (
                  <ResponseBox responseMarkdown={message.text} />
                )}
              </Box>
            ))
            .reverse()}

          {chatLog.length > 0 && (
            <Center
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              mt={2}
            >
              <Button
                size="sm"
                leftIcon={<NotAllowedIcon />}
                onClick={clearChatLog}
                colorScheme="red"
              >
                Reset Chat
              </Button>
            </Center>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default App;
