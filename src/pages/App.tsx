import Search from "../components/Search";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import ResponseBox from "../components/ResponseBox";
import { memo, useCallback, useState } from "react";
import { chatComplete } from "../util/llm";
import { AnimatePresence, motion } from "framer-motion";
import UnauthorizedErrorBox from "../components/UnauthorizedErrorBox";
import ErrorBox from "../components/ErrorBox";
import PromptBox from "../components/PromptBox";
import useChatLog, { ChatMessage } from "../util/hooks/useChatLog";
import { NotAllowedIcon, RepeatIcon } from "@chakra-ui/icons";
import { Message, useChat } from "../util/ai";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [bgClicked, setBgClicked] = useState(false);
  // const { chatLog, addUser, addAssistant, clearChatLog } = useChatLog();
  const { messages, addPrompt, reset } = useChat();
  const [error, setError] = useState<Error | null>(null);

  const handleBgClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target !== e.currentTarget) {
        return;
      }

      setBgClicked(true);
      setTimeout(() => {
        setBgClicked(false);
      }, 200);
    },
    []
  );

  const handleGenerate = useCallback(
    async (prompt: string, temperature = 1.0) => {
      if (isLoading || !prompt) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await addPrompt(prompt, temperature);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        }
      }
      setIsLoading(false);
    },
    [addPrompt]
  );

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
        onClear={reset}
        isLoading={isLoading}
        mb={2}
      />

      <Box overflowY="auto" maxH="100%">
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

        <Messages messages={messages} />

        {/* {messages.length > 0 && (
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
                onClick={reset}
                colorScheme="red"
              >
                Reset Chat
              </Button>
            </Center>
          )} */}
      </Box>
    </Box>
  );
}

function Messages({ messages }: { messages: Message[] }) {
  return (
    <>
      {[...messages]
        .map((message) => (
          <Box key={message.id} mb={2}>
            <MessageDisplay message={message} />
          </Box>
        ))
        .reverse()}
    </>
  );
}

const MessageDisplay = memo(({ message }: { message: Message }) => {
  return <ResponseBox responseMarkdown={message.content} />;
});

export default App;
