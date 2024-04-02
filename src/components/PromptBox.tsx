import { Box, Text } from "@chakra-ui/react";

const PromptBox = ({ prompt }: { prompt: string }) => {
  return (
    <Box bg="blackAlpha.800" p={4} rounded="md">
      <Text fontStyle="italic">{prompt}</Text>
    </Box>
  );
};

export default PromptBox;
