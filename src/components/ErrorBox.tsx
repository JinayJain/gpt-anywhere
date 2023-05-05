import { Text, Box, Heading, Link } from "@chakra-ui/react";

const ErrorBox = ({ error }: { error: Error }) => {
  return (
    <Box bg={"whiteAlpha.800"} p={4}>
      <Heading size="sm" color={'black'}>
        An error occurred while generating a response.
      </Heading>

      <Text color={'black'}>
        Please try again. If the problem persists, please{" "}
        <Link
          href="https://github.com/jinayjain/gpt-anywhere/issues"
          isExternal
          color="blue.600"
        >
          open an issue
        </Link>
        .
      </Text>

      <Text mt={4} color={'black'}>
        {error.name}: {error.message}
      </Text>
    </Box>
  );
};

export default ErrorBox;
