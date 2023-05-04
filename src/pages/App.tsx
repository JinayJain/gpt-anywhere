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
import ConfirmationBox from "../components/ConfirmationBox";

const CLEAR_TEXT = "";
// const CLEAR_TEXT = fillerMarkdown;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tempPrompt, setTempPrompt] = useState<string>("");
  const [tempFiles, setTempFiles] = useState<any>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [bgClicked, setBgClicked] = useState(false);
  const { chatLog, addPrompt, addResponse, clearChatLog, popChatLog } =
    useChatLog();
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
  const handleClearChatLog = () => {
    clearChatLog();
    setError(null);
    setShowConfirmation(false);
  };

  const handleGenerate = async (prompt: string, temperature = 1.0) => {
    console.log("prompt", prompt);
    if (prompt) {
      const chatHistory: ChatMessage[] = [
        ...chatLog,
        { type: "prompt", text: prompt },
      ];

      setError(null);
      addPrompt(prompt);
      setIsLoading(true);
      setShowConfirmation(false);

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

  const handleConfirmation = async (prompt: string, temperature = 1.0) => {
    if (prompt) {
      const str = prompt;
      const regex = /#\(([^[]+)\[[^\]]+\]\)/g;
      const matches = [];
      let match;
      while ((match = regex.exec(str)) !== null) {
        matches.push(match[1]);
      }
      console.log(matches);
      if (matches && matches?.length !== 0) {
        setTempPrompt(prompt);
        setTempFiles(matches);
        // addPrompt(prompt);
        setShowConfirmation(true);
      } else {
        handleGenerate(prompt, temperature);
      }
    }
  };
  const handleCancelConfirmation = async () => {
    setShowConfirmation(false);
    setTempPrompt("");
    setTempFiles([]);
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
        onGenerate={handleConfirmation}
        // onClear={() => {
        //   handleClearChatLog();
        //   setShowConfirmation(false);
        // }}
        isLoading={isLoading}
        mb={2}
      />

      <Box overflowY="auto" maxH="100%">
        <AnimatePresence>
          {error && (
            <Box
              key={"error-1"}
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
          {showConfirmation && (
            <Box
              key={"confirmation-1"}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ConfirmationBox
                prompt={"asd"}
                onGenerate={handleGenerate}
                onCancel={handleCancelConfirmation}
                tempPrompt={tempPrompt}
                tempFiles={tempFiles}
              />
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
            // .reverse()
            }

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
                onClick={handleClearChatLog}
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
