import { DragHandleIcon } from "@chakra-ui/icons";
import { Box, Code, Divider, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box>
    <Heading size="md" mt={4}>
      {title}
    </Heading>
    <Divider my={2} />
    <Stack mt={2}>{children}</Stack>
  </Box>
);

function Help() {
  return (
    <Box p={4}>
      <Heading>Help</Heading>
      <Heading size="md" color="whiteAlpha.600" fontWeight="normal">
        Getting Started with GPT Anywhere
      </Heading>
      <Stack spacing={4} mt={4}>
        <Section title="Open/Close GPT Anywhere">
          <Text>
            To open GPT Anywhere, use the keyboard shortcut{" "}
            <Code>Ctrl + Shift + /</Code> or <Code>Cmd + Shift + /</Code> on
            Mac. This will open the main prompting window. You can close this
            window by pressing the same keyboard shortcut again.
          </Text>
          <Text>
            You can move this window by dragging the <DragHandleIcon /> icon.
          </Text>
        </Section>

        <Section title="Configure GPT Anywhere">
          <Text>
            To configure GPT Anywhere, click the tray icon and select
            "Settings". In the settings window, you can configure your API key,
            response timeout, and max tokens per request.
          </Text>
        </Section>

        <Section title="Using GPT Anywhere">
          <Text>
            To use GPT Anywhere, type your prompt into the main window and press
            enter. GPT Anywhere will then send your prompt to the OpenAI API and
            display the response in the main window.
          </Text>
        </Section>
      </Stack>
    </Box>
  );
}

export default Help;
