import { Box, BoxProps, Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";

function Search({
  onGenerate = () => {},
  isLoading = false,
  ...props
}: { onGenerate?: (prompt: string) => void; isLoading?: boolean } & BoxProps) {
  const [prompt, setPrompt] = useState("");

  return (
    <Box display="flex" flexDirection="column" {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate(prompt);
        }}
      >
        <HStack>
          <Input
            size="lg"
            placeholder="Unleash your creativity"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            autoFocus
            bg="blackAlpha.800"
            _placeholder={{ color: "whiteAlpha.500" }}
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
