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
            placeholder="Unleash your creativity"
            variant="filled"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            autoFocus
          />

          <Button
            alignSelf="center"
            colorScheme="blue"
            variant="outline"
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
