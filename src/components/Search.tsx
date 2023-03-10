import { Box, BoxProps, Button, HStack, Input } from "@chakra-ui/react";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useRef, useState } from "react";

function Search({
  onGenerate = () => {},
  isLoading = false,
  ...props
}: { onGenerate?: (prompt: string) => void; isLoading?: boolean } & BoxProps) {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unlisten = listen("show", (e) => {
      inputRef.current?.focus();
    });

    return () => {
      unlisten.then((unlisten) => unlisten());
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("GENERATING Prompt");
          onGenerate(prompt);
        }}
      >
        <HStack>
          <Input
            ref={inputRef}
            size="lg"
            placeholder="Unleash your creativity"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            autoFocus
            bg="blackAlpha.800"
            _placeholder={{ color: "whiteAlpha.500" }}
            onMouseDown={(e) => {
              appWindow.startDragging();
            }}
          />

          <Button
            size="lg"
            alignSelf="center"
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
          >
            Generate
          </Button>
        </HStack>
      </form>
    </Box>
  );
}

export default Search;
