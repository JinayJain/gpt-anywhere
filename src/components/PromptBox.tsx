import { Box, Text } from "@chakra-ui/react";

const PromptBox = ({ prompt }: { prompt: string }) => {
  function convertString(input: string) {
    // Regular expression to match unwanted characters
    const regex = /#\(?(.*?)\[[^\[\]]*\]\)?/g;

    // Replace unwanted characters and maintain the text inside parentheses
    const result = input.replace(regex, "$1 ").replace(/\s+/g, " ").trim();

    return result;
  }
  return (
    <Box bg="whiteAlpha.700" p={4} rounded="md">
      <Text color={"black"} fontStyle="italic">
        {convertString(prompt)}
      </Text>
    </Box>
  );
};

export default PromptBox;
