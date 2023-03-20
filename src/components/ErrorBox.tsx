import { Text, Box, Heading, Link } from "@chakra-ui/react";

const ErrorBox = ({ error }: { error: Error }) => {
  return (
    <Box p={4}>
      <Heading size="sm">
        An error occurred while generating a response.
      </Heading>

      <Text>
        Please try again. If the problem persists, please{" "}
        <Link
          href="https://github.com/jinayjain/gpt-anywhere/issues"
          isExternal
          color="blue.500"
        >
          open an issue
        </Link>
        .
      </Text>

      <Text mt={4} color="whiteAlpha.600">
        {error.name}: {error.message}
      </Text>
    </Box>
  );
};

export default ErrorBox;
