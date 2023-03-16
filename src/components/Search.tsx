import {
  Box,
  BoxProps,
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { GrDrag } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import { DragHandleIcon, PhoneIcon } from "@chakra-ui/icons";

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
          <InputGroup size="lg">
            <Input
              ref={inputRef}
              placeholder="Unleash your creativity"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              autoFocus
              bg="blackAlpha.800"
              _placeholder={{ color: "whiteAlpha.500" }}
            />
            <InputRightElement
              children={
                <DragHandleIcon
                  cursor="grab"
                  color="whiteAlpha.500"
                  data-tauri-drag-region
                />
              }
            />
          </InputGroup>

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
