import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";

function UnauthorizedErrorBox() {
  return (
    <Stack p={4}>
      <Heading size="sm">Invalid API Key</Heading>
      <Text>
        Please make sure you have set your OpenAI API key in the settings.
      </Text>
      <Button
        alignSelf="start"
        variant="outline"
        colorScheme="blue"
        onClick={() => invoke("open_settings")}
      >
        Open Settings
      </Button>
    </Stack>
  );
}

export default UnauthorizedErrorBox;
